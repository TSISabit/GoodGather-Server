import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const verifyJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Unauthorized: Missing or malformed token' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & AuthenticatedUser;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
    };
    next();
  } catch {
    res.status(403).json({ success: false, message: 'Forbidden: Invalid or expired token' });
  }
};