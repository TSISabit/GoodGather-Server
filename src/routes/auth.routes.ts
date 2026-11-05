import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId, WithId } from 'mongodb';
import { connectDB } from '../config/db';

const router = Router();

interface UserDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  password?: string;
  photoURL: string;
  createdAt: Date;
  authProvider: 'email' | 'google';
}

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, photoURL } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      photoURL?: string;
    };

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'All required fields must be filled.' });
      return;
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasLength = password.length >= 6;

    if (!hasUpper || !hasLower || !hasLength) {
      res.status(400).json({
        success: false,
        message: 'Password must have an uppercase, a lowercase, and at least 6 characters.',
      });
      return;
    }

    const db = await connectDB();
    const existing = await db.collection<UserDocument>('users').findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: UserDocument = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      photoURL: photoURL && photoURL.trim() !== '' ? photoURL : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      createdAt: new Date(),
      authProvider: 'email',
    };

    const result = await db.collection<UserDocument>('users').insertOne(newUser);
    const token = jwt.sign(
      { userId: result.insertedId.toString(), email: newUser.email, name: newUser.name },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: result.insertedId.toString(),
        name: newUser.name,
        email: newUser.email,
        photoURL: newUser.photoURL,
      },
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const db = await connectDB();
    const user = await db.collection<UserDocument>('users').findOne({ email: email.toLowerCase() });
    if (!user || !user.password) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, name: user.name },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
      },
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/google', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, photoURL } = req.body as { email?: string; name?: string; photoURL?: string };
    if (!email || !name) {
      res.status(400).json({ success: false, message: 'Google profile payload is invalid.' });
      return;
    }

    const db = await connectDB();
    const usersCollection = db.collection<UserDocument>('users');
    let user: WithId<UserDocument> | null = await usersCollection.findOne({ email: email.toLowerCase() });

    if (!user) {
      const newUser: UserDocument = {
        name,
        email: email.toLowerCase(),
        photoURL: photoURL && photoURL.trim() !== '' ? photoURL : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        createdAt: new Date(),
        authProvider: 'google',
      };
      const result = await usersCollection.insertOne(newUser);
      user = { ...newUser, _id: result.insertedId };
    }

    if (!user) {
      res.status(500).json({ success: false, message: 'Failed to process Google user.' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, name: user.name },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
      },
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;