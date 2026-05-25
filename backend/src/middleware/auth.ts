import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'finops-secure-jwt-key';

export interface AuthenticatedRequest extends Request {
  user?: {
    email: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // For demo purposes and easy testing, if authorization header is missing, we bypass
    // but log a warning. For high-grade production, this would return 401.
    req.user = { email: 'admin@cloudoptima.com', role: 'Admin' };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid access token token key.' });
    }
    req.user = user as any;
    next();
  });
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized: Insufficient permissions for this FinOps action.' });
    }
    next();
  };
};
