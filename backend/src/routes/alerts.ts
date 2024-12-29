import { Router } from 'express';
import PromiseRouter from 'express-promise-router';
import AlertsController from '../modules/alerts/AlertsController';
import { validateSchema } from "../middleware/schemaValidator";
import schemas from "../schemas";
import { verifyToken } from '../middleware/authMiddleware';
import { isTeamAdmin } from '../middleware/teamAdminMiddleware';

const route = PromiseRouter();

export const AlertRoutes = (app: Router): void => {
  app.use('/alerts', route);

  /**
   * @swagger
   * tags:
   *   name: Alerts
   *   description: Alert management
   */

  /**
   * @swagger
   * /alerts/team/{teamId}/user/{userId}:
   *   get:
   *     tags: [Alerts]
   *     summary: Get all alerts by user ID and team ID
   *     description: Retrieve a list of all alerts by user ID and team ID
   *     parameters:
   *       - in: path
   *         name: teamId
   *         required: true
   *         description: ID of the team to retrieve alerts
   *         schema:
   *           type: string
   *       - in: path
   *         name: userId
   *         required: true
   *         description: ID of the user to retrieve alerts
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: A list of alerts
   *       404:
   *         description: Alerts not found
   */
    route.get(
      '/team/:teamId/user/:userId',
      // TODO: use middleware to check if the team is valid?
      verifyToken,
      validateSchema(schemas.alerts.getUserAlertsSchema),
      async (req: any, res: any) => {
        const alerts = await AlertsController.getTeamUserAlerts(req);
        res.status(200).json(alerts);
      }
    );
  
  /**
   * @swagger
   * /alerts/{teamId}:
   *   get:
   *     tags: [Alerts]
   *     summary: Get all alerts by team ID
   *     description: Retrieve a list of all alerts by team ID
   *     parameters:
   *       - in: path
   *         name: teamId
   *         required: true
   *         description: ID of the team to retrieve alerts
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: A list of alerts
   *       404:
   *         description: Alerts not found
   */
  route.get(
    '/team/:teamId',
    // TODO: use middleware to check if the team is valid?
    verifyToken,
    validateSchema(schemas.alerts.getTeamAlertsSchema),
    async (req: any, res: any) => {
      const alerts = await AlertsController.getAlertsByTeam(req);
      res.status(200).json(alerts);
    }
  );

  route.post(
    '/webhook/:teamId',
    // TODO: add middleware to verify the webhook token
    // verifyWebhookToken,
    validateSchema(schemas.alerts.postAlertSchema),
    async (req: any, res: any) => {
      const newAlert = await AlertsController.createAlert(req);
      res.status(201).json(newAlert);
    }
  )

  /**
   * @swagger
   * /alerts/{id}/acknowledge:
   *   get:
   *     tags: [Alerts]
   *     summary: Acknowledge an alert
   *     description: Acknowledge an alert
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the alert to acknowledge
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Alert acknowledged
   */
  route.get(
    '/:id/acknowledge', 
    verifyToken,
    validateSchema(schemas.alerts.getAlertsSchema), 
    async (req: any, res: any) => {
      const alert = await AlertsController.acknowledgeAlert(req);
      res.status(200).json(alert);
    }
  );

  /**
   * @swagger
   * /alerts/{id}/escalate:
   *   get:
   *     tags: [Alerts]
   *     summary: Escalate an alert
   *     description: Escalate an alert
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the alert to escalate
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Alert escalated
   */
  route.get(
    '/:id/escalate',
    verifyToken,
    validateSchema(schemas.alerts.getAlertsSchema),
    async (req: any, res: any) => {
    const alert = await AlertsController.escalateAlert(req);
    res.status(200).json(alert);
  });

  /**
   * @swagger
   * /alerts/{id}:
   *   get:
   *     tags: [Alerts]
   *     summary: Get an alert by ID
   *     description: Retrieve an alert by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the alert to retrieve
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: An alert object
   *       404:
   *         description: Alert not found
   */
  route.get(
    '/:id',
    verifyToken,
    validateSchema(schemas.alerts.getAlertsSchema),
    async (req: any, res: any) => {
      const alert = await AlertsController.getAlertById(req);
      res.status(200).json(alert);
    }
  );

  /**
   * @swagger
   * /alerts/{id}:
   *   put:
   *     tags: [Alerts]
   *     summary: Update an alert
   *     description: Update an alert
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the alert to update
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
   *             description:
   *               type: string
   *     responses:
   *       200:
   *         description: Alert updated
   */
  route.put(
    '/:id',
    verifyToken,
    validateSchema(schemas.alerts.updateAlertSchema), 
    async (req: any, res: any) => {
      const updatedAlert = await AlertsController.updateAlert(req);
      res.status(200).json(updatedAlert);
    }
  );

  /**
   * @swagger
   * /alerts/{id}:
   *   delete:
   *     tags: [Alerts]
   *     summary: Delete an alert
   *     description: Delete an alert
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the alert to delete
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Alert deleted
   */
  route.delete(
    '/:id',
    verifyToken,
    isTeamAdmin,
    validateSchema(schemas.alerts.getAlertsSchema), 
    async (req: any, res: any) => {
      await AlertsController.deleteAlert(req);
      res.status(200).send({ message: 'Alert deleted' });
    }
  );

  /**
   * @swagger
   * /alerts:
   *   post:
   *     tags: [Alerts]
   *     summary: Create a new alert
   *     description: Create a new alert
   *     requestBody:
   *       required: true
   *     content:
   *       application/json:
   *         schema:
   *           type: object
   *           properties:
   *             name:
   *               type: string
   *             description:
   *               type: string
   *     responses:
   *      201:
   *        description: Alert created
   */
  route.post(
    '/',
    // TODO: how to handle duplicate alerts?
    verifyToken,
    validateSchema(schemas.alerts.postAlertSchema),
    async (req: any, res: any) => {
      const newAlert = await AlertsController.createAlert(req);
      res.status(201).json(newAlert);
  });
};
