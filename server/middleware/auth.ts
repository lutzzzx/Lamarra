import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'test') {
      return 'test_secret_key_only_for_unit_tests';
    }
    throw new Error('FATAL: JWT_SECRET environment variable is missing.');
  }
  return secret;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const cookieToken = req.cookies?.lamarra_auth;
  const authHeader = req.headers['authorization'];
  const headerToken = authHeader && authHeader.split(' ')[1];
  const token = cookieToken || headerToken;

  if (!token || token === 'undefined' || token === 'null') {
    return res.status(401).json({ success: false, error: 'Akses ditolak. Token otentikasi tidak ditemukan.' });
  }

  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret) as { id: string; email: string; name: string };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Token tidak valid atau telah kedaluwarsa.' });
  }
};
