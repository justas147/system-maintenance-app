import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import UsersData from '../modules/users/UsersData';
import { HttpError } from '../core/errorHandler';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the "Authorization" header

  if (!token) {
    throw new HttpError(401, 'Unauthorized');
  }

  let user;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    user = await UsersData.findById((decoded as any).id);
  } catch (err) {
    throw new HttpError(401, 'Unauthorized');
  }

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  req.user = user;
  next();
};

export const googleLogin = async (req: Request, res: Response) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })
}

export const googleCallback = async (req: Request, res: Response) => {
  passport.authenticate(
    'google',
    { session: false },
    (req: Request, res: Response) => {
      const token = jwt.sign({ id: (req.user as any).id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      
      res.redirect(`http://localhost:3000/?token=${token}`);
    }
  );
}