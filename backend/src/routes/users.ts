import { Router, Request, Response } from 'express';
import PromiseRouter from 'express-promise-router';
import UsersController from '../modules/users/UsersController';
import { verifyToken } from '../middleware/authMiddleware';
import { validateSchema } from '../middleware/schemaValidator';
import schemas from '../schemas';
import UsersData from '../modules/users/UsersData';
import { HttpError } from '../core/errorHandler';

const route = PromiseRouter();

export const UserRoutes = (app: Router): void => {
  app.use('/users', route);

  /**
   * @swagger
   * tags:
   *   name: Users
   *   description: User management
   */

  /**
   * @swagger
   * /users/profile:
   *   get:
   *     tags: [Users]
   *     summary: Get user profile
   *     description: Retrieve user profile
   *     responses:
   *       200:
   *         description: A user object
   */
  route.get(
    '/profile',
    verifyToken, 
    async (req: any, res: any) => {
      const reqUser = req.user;
      console.log('User:', reqUser.id);
      const user = await UsersData.findById(reqUser.id);

      if (!user) {
        throw new HttpError(404, 'User not found');
      }

      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        googleId: user.googleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    }
  );

  /**
   * @swagger
   * /users/register:
   *   post:
   *     tags: [Users]
   *     summary: Register a new user
   *     description: Register a new user
   *     requestBody:
   *       required: true
   *     content:
   *       application/json:
   *         schema:
   *           type: object
   *           properties:
   *             name:
   *               type: string
   *             email:
   *               type: string
   *             password:
   *               type: string
   *     responses:
   *       200:
   *         description: A user object
   */
    route.post(
      '/register',
      validateSchema(schemas.users.registerUserSchema), 
      async (req: Request, res: Response) => {
        const result = UsersController.register(req);
        res.json(result);
      }
    );

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     tags: [Users]
   *     summary: Get a user by ID
   *     description: Retrieve a user by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the user to retrieve
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: A user object
   *       404:
   *         description: User not found
   */
  route.get(
    '/:id',
    verifyToken,
    validateSchema(schemas.users.getUserSchema), 
    async (req: any, res: any) => {
    const users = UsersController.getById(req);
    res.status(200).json(users);
  });
  
  /**
   * @swagger
   * /users:
   *   post:
   *     tags: [Users]
   *     summary: Create a new user
   *     description: Create a new user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *     responses:
   *      200:
   *        description: A user object
   */
  route.post(
    '/',
    verifyToken,
    validateSchema(schemas.users.postUserSchema),
    async (req: any, res: any) => {
      const newUser = UsersController.create(req);
      res.json(newUser);
    }
  );

  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     tags: [Users]
   *     summary: Update a user by ID
   *     description: Update a user by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the user to update
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *     content:
   *       application/json:
   *         schema:
   *           type: object
   *           properties:
   *             name:
   *               type: string
   *             email:
   *               type: string
   *     responses:
   *       200:
   *         description: A user object
   *       404:
   *         description: User not found
   */
  route.put(
    '/:id',
    verifyToken,
    validateSchema(schemas.users.updateUserSchema),
    async (req: any, res: any) => {
      const updatedUser = UsersController.update(req);
      res.json(updatedUser);
    }
  );

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     tags: [Users]
   *     summary: Delete a user by ID
   *     description: Delete a user by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the user to delete
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: User deleted
   */
  route.delete(
    '/:id',
    verifyToken,
    validateSchema(schemas.users.getUserSchema),
    async (req: any, res: any) => {
      UsersController.deleteUser(req);
      res.status(204).send();
    }
  );
};
