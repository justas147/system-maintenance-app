import { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const localLogin = async (req: Request, res: Response) => {
  passport.authenticate(
    'local', 
    { 
      session: false,
    }, 
    (err: any, user: any, info: any) => {
      if (err || !user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id }, 
        process.env.JWT_SECRET!, 
        { expiresIn: process.env.JWT_EXPIRES_IN ?? '30d' },
      );

      res.json({ message: 'Login successful', token });
    }
  );
}

const googleCallback = async (req: Request, res: Response) => {
  passport.authenticate(
    'google',
    { session: false },
    (req: Request, res: Response) => {
      const token = jwt.sign(
        { id: (req.user as any).id }, 
        process.env.JWT_SECRET!, 
        { expiresIn: process.env.JWT_EXPIRES_IN ?? '30d' },
      );
      res.redirect(`http://localhost:3000/?token=${token}`);
    }
  );
}

export default {
  localLogin,
  googleCallback,
};