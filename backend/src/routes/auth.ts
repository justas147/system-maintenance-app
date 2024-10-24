import { Request, Response, Router } from 'express';
import UserController from '../modules/users/UsersController';
import AuthController from '../modules/auth/AuthController';
import { googleCallback, googleLogin } from '../middleware/authMiddleware';
import PromiseRouter from 'express-promise-router';

const route = PromiseRouter();

export const AuthRoutes = (app: Router): void => {
  app.use('/auth', route);

  /**
   * @swagger
   * tags:
   *   name: Auth
   *   description: Authentication management
   */

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     tags: [Auth]
   *     summary: Login
   *     description: Login with email and password
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 
   *               password:
   *                 type: string
   *             example:
   *               email: "john.doe@example.com"
   *               password: "password"
   *     responses:
   *       200:
   *         description: Login successful
   *       401:
   *         description: Unauthorized
   */ 
  route.post('/login', async (req: Request, res: Response, next) => {
    const token = await UserController.login(req)
    res.status(200).json(token);
  });

  route.get('/google', googleLogin);
  route.get('/google/callback', googleCallback);
};
