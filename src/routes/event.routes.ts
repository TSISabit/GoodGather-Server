import { Router, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { connectDB } from '../config/db';
import { verifyJWT, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

export interface EventDocument {
  _id?: ObjectId;
  title: string;
  description: string;
  eventType: 'Cleanup' | 'Plantation' | 'Donation' | 'Healthcare' | 'Education' | 'Other';
  thumbnailUrl: string;
  location: string;
  eventDate: string; 
  creatorEmail: string;
  creatorName: string;
  createdAt: Date;
}

export interface JoinedEventDocument {
  _id?: ObjectId;
  eventId: string;
  userEmail: string;
  userName: string;
  joinedAt: Date;
  eventDetails: EventDocument;
}

router.get('/recent', async (_req: Request, res: Response): Promise<void> => {
  try {
    const db = await connectDB();
    const today = new Date().toISOString().split('T')[0];

    const events = await db
      .collection<EventDocument>('events')
      .find({ eventDate: { $gte: today } })
      .sort({ eventDate: 1 })
      .limit(6)
      .toArray();

    res.json({ success: true, data: events });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/upcoming', async (_req: Request, res: Response): Promise<void> => {
  try {
    const db = await connectDB();
    const today = new Date().toISOString().split('T')[0];

    const events = await db
      .collection<EventDocument>('events')
      .find({ eventDate: { $gte: today } })
      .sort({ eventDate: 1 })
      .toArray();

    res.json({ success: true, data: events });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/detail/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid event identifier' });
      return;
    }

    const db = await connectDB();
    const event = await db.collection<EventDocument>('events').findOne({ _id: new ObjectId(id) });
    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    res.json({ success: true, data: event });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/create', verifyJWT, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, description, eventType, thumbnailUrl, location, eventDate } = req.body as Partial<EventDocument>;

    if (!title || !description || !eventType || !thumbnailUrl || !location || !eventDate) {
      res.status(400).json({ success: false, message: 'All fields are required.' });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (eventDate < today) {
      res.status(400).json({ success: false, message: 'Past dates are not allowed. Please select a future date.' });
      return;
    }

    const db = await connectDB();
    const newEvent: EventDocument = {
      title,
      description,
      eventType,
      thumbnailUrl,
      location,
      eventDate,
      creatorEmail: req.user!.email,
      creatorName: req.user!.name,
      createdAt: new Date(),
    };

    const result = await db.collection<EventDocument>('events').insertOne(newEvent);
    res.status(201).json({ success: true, data: { ...newEvent, _id: result.insertedId } });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/join/:id', verifyJWT, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid event ID' });
      return;
    }

    const db = await connectDB();
    const event = await db.collection<EventDocument>('events').findOne({ _id: new ObjectId(id) });
    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    const alreadyJoined = await db.collection<JoinedEventDocument>('joined_events').findOne({
      eventId: id,
      userEmail: req.user!.email,
    });

    if (alreadyJoined) {
      res.status(409).json({ success: false, message: 'You have already joined this event.' });
      return;
    }

    const joinRecord: JoinedEventDocument = {
      eventId: id,
      userEmail: req.user!.email,
      userName: req.user!.name,
      joinedAt: new Date(),
      eventDetails: event,
    };

    await db.collection<JoinedEventDocument>('joined_events').insertOne(joinRecord);
    res.status(201).json({ success: true, message: 'Event joined successfully' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/my-joined', verifyJWT, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const db = await connectDB();
    const joined = await db
      .collection<JoinedEventDocument>('joined_events')
      .find({ userEmail: req.user!.email })
      .sort({ 'eventDetails.eventDate': 1 })
      .toArray();

    res.json({ success: true, data: joined });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/my-events', verifyJWT, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const db = await connectDB();
    const events = await db
      .collection<EventDocument>('events')
      .find({ creatorEmail: req.user!.email })
      .sort({ eventDate: 1 })
      .toArray();

    res.json({ success: true, data: events });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/update/:id', verifyJWT, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid event identifier' });
      return;
    }

    const db = await connectDB();
    const event = await db.collection<EventDocument>('events').findOne({ _id: new ObjectId(id) });
    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    if (event.creatorEmail !== req.user!.email) {
      res.status(403).json({ success: false, message: 'Forbidden: You can only edit your own events.' });
      return;
    }

    const { title, description, eventType, thumbnailUrl, location, eventDate } = req.body as Partial<EventDocument>;
    const today = new Date().toISOString().split('T')[0];

    if (eventDate && eventDate < today) {
      res.status(400).json({ success: false, message: 'Event date cannot be in the past.' });
      return;
    }

    await db.collection<EventDocument>('events').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...(title && { title }),
          ...(description && { description }),
          ...(eventType && { eventType }),
          ...(thumbnailUrl && { thumbnailUrl }),
          ...(location && { location }),
          ...(eventDate && { eventDate }),
        },
      }
    );

    res.json({ success: true, message: 'Event updated successfully.' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/delete/:id', verifyJWT, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid event ID' });
      return;
    }

    const db = await connectDB();
    const event = await db.collection<EventDocument>('events').findOne({ _id: new ObjectId(id) });
    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    if (event.creatorEmail !== req.user!.email) {
      res.status(403).json({ success: false, message: 'Forbidden: You can only delete your own events.' });
      return;
    }

    await db.collection<EventDocument>('events').deleteOne({ _id: new ObjectId(id) });
    await db.collection<JoinedEventDocument>('joined_events').deleteMany({ eventId: id });

    res.json({ success: true, message: 'Event and associated joined records deleted successfully.' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;