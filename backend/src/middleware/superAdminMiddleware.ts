import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../core/errorHandler';

export const isSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {

  if (!req.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  const user = req.user;

  if (!user.isSuperAdmin) {
    throw new HttpError(403, 'You are not authorized to perform this action');
  }

  next();
};