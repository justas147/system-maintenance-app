import { Router } from 'express';
import PromiseRouter from 'express-promise-router';
import SchedulesController from '../modules/schedules/SchedulesController';
import { verifyToken } from '../middleware/authMiddleware';
import { validateSchema } from '../middleware/schemaValidator';
import schemas from '../schemas';

const route = PromiseRouter();

export const ScheduleRoutes = (app: Router): void => {
  app.use('/schedules', route);

  /**
   * @swagger
   * tags:
   *   name: Schedules
   *   description: Schedule management
   */

  /**
   * @swagger
   * /schedules/teams/{teamId}/user/{userId}/disabled:
   *   get:
   *     tags: [Schedules]
   *     summary: Get disabled date list for team (used in date range selection)
   *     description: Retrieve a list of all dates to disable by team ID and user ID
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         description: ID of the user to retrieve the schedules
   *         schema:
   *           type: string
   *       - in: path
   *         name: teamId
   *         required: true
   *         description: ID of the team to retrieve the schedules
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: A list of schedules
   *       404:
   *         description: Schedules not found
   */
  route.get(
    '/teams/:teamId/user/:userId/disabled',
    verifyToken,
    validateSchema(schemas.schedules.getTeamUserScheduleSchema), 
    async (req: any, res: any) => {
      const schedules = await SchedulesController.getTeamScheduleDateList(req);
      res.status(200).json(schedules);
    }
  );

  /**
   * @swagger
   * /schedules/{teamId}/user/{userId}:
   *   get:
   *     tags: [Schedules]
   *     summary: Get team schedules for user
   *     description: Retrieve a list of all schedules by team ID and user ID
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         description: ID of the user to retrieve the schedules
   *         schema:
   *           type: string
   *       - in: path
   *         name: teamId
   *         required: true
   *         description: ID of the team to retrieve the schedules
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: A list of schedules
   *       404:
   *         description: Schedules not found
   */
  route.get(
    '/teams/:teamId/user/:userId',
    verifyToken,
    validateSchema(schemas.schedules.getTeamUserScheduleSchema), 
    async (req: any, res: any) => {
      const schedules = await SchedulesController.getTeamScheduleRanges(req);
      res.status(200).json(schedules);
    }
  );
    

  /**
   * @swagger
   * /schedules/{userId}:
   *   get:
   *     tags: [Schedules]
   *     summary: Get all schedules by user ID
   *     description: Retrieve a list of all schedules by user ID
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         description: ID of the user to retrieve the schedules
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: A list of schedules
   *       404:
   *         description: Schedules not found
   */
  route.get(
    '/user/:userId',
    verifyToken,
    validateSchema(schemas.schedules.getUserScheduleSchema), 
    async (req: any, res: any) => {
      const schedules = await SchedulesController.getByUserId(req);
      res.status(200).json(schedules);
    }
  );

  /**
   * @swagger
   * /schedules/{teamId}:
   *   get:
   *     tags: [Schedules]
   *     summary: Get all schedules by team ID
   *     description: Retrieve a list of all schedules by team ID
   *     parameters:
   *       - in: path
   *         name: teamId
   *         required: true
   *         description: ID of the team to retrieve the schedules
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: A list of schedules
   *       404:
   *         description: Schedules not found
   */
  route.get(
    '/teams/:teamId',
    verifyToken,
    validateSchema(schemas.schedules.getTeamScheduleSchema), 
    async (req: any, res: any) => {
      const schedules = await SchedulesController.getByTeamId(req);
      res.status(200).json(schedules);
    }
  );

  /**
   * @swagger
   * /schedules/{id}:
   *   get:
   *     tags: [Schedules]
   *     summary: Get a schedule by ID
   *     description: Retrieve a schedule by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the schedule to retrieve
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: A schedule object
   *       404:
   *         description: Schedule not found
   */
  route.get(
    '/:id',
    verifyToken,
    validateSchema(schemas.schedules.getScheduleSchema), 
    async (req: any, res: any) => {
      const schedule = await SchedulesController.getById(req);
      res.status(200).json(schedule);
    }
  );

  /**
   * @swagger
   * /schedules/{id}:
   *   put:
   *     tags: [Schedules]
   *     summary: Update a schedule
   *     description: Update a schedule
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the schedule to update
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               teamId:
   *                 type: string
   *               userId:
   *                 type: string
   *               date:
   *                 type: string
   *     responses:
   *      200:
   *        description: A schedule object
   */
  route.put(
    '/:id',
    verifyToken,
    validateSchema(schemas.schedules.updateScheduleSchema), 
    async (req: any, res: any) => {
      const updatedSchedule = await SchedulesController.update(req);
      res.status(200).json(updatedSchedule);
    }
  );

  /**
   * @swagger
   * /schedules/{id}:
   *   delete:
   *     tags: [Schedules]
   *     summary: Delete a schedule
   *     description: Delete a schedule by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the schedule to delete
   *         schema:
   *           type: string
   *     responses:
   *      200:
   *        description: Schedule deleted
   */
  route.delete(
    '/:id',
    verifyToken,
    validateSchema(schemas.schedules.getScheduleSchema), 
    async (req: any, res: any) => {
      const afterRemovedSchedule = await SchedulesController.deleteSchedule(req);
      res.status(200).json(afterRemovedSchedule);
    }
  );
  
  /**
   * @swagger
   * /schedules:
   *   post:
   *     tags: [Schedules]
   *     summary: Create a new schedule
   *     description: Create a new schedule
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               teamId:
   *                 type: string
   *               userId:
   *                 type: string
   *               date:
   *                 type: string
   *     responses:
   *      201:
   *        description: A schedule object
   */
  route.post(
    '/',
    verifyToken,
    validateSchema(schemas.schedules.postScheduleSchema), 
    async (req: any, res: any) => {
      const newSchedule = await SchedulesController.create(req);
      res.status(201).json(newSchedule);
    }
  );
};
