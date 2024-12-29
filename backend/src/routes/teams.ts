import { Router } from 'express';
import PromiseRouter from 'express-promise-router';
import TeamsController from '../modules/teams/TeamsController';
import { isTeamAdmin } from '../middleware/teamAdminMiddleware';
import { verifyToken } from '../middleware/authMiddleware';
import { validateSchema } from '../middleware/schemaValidator';
import schemas from '../schemas';
import { isSuperAdmin } from '../middleware/superAdminMiddleware';

const route = PromiseRouter();

export const TeamRoutes = (app: Router): void => {
  app.use('/teams', route);

  /**
   * @swagger
   * tags:
   *   name: Teams
   *   description: Team management
   */
 
  /**
   * @swagger
   * /teams/user/{userId}:
   *  get:
   *    tags: [Teams]
   *    summary: Get teams by user ID
   *    description: Retrieve teams data by user ID
   *    parameters:
   *      - in: path
   *        name: userId
   *        required: true
   *        description: ID of the user to retrieve the teams
   *        schema:
   *          type: string
   *    responses:
   *      200:
   *        description: A team list
   *      404:
   *        description: Team not found
   */
  route.get(
    '/user/:userId',
    verifyToken,
    validateSchema(schemas.teams.getUserTeamSchema), 
    async (req: any, res: any) => {
      const userTeams = await TeamsController.getUserTeam(req);
      res.json(userTeams);
    }
  );

  /**
   * @swagger
   * /teams/{id}:
   *  get:
   *    tags: [Teams]
   *    summary: Get a team by ID
   *    description: Retrieve a team by ID
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: ID of the team to retrieve
   *        schema:
   *          type: string
   *    responses:
   *      200:
   *        description: A team object
   *      404:
   *        description: Team not found
   */
  route.get(
    '/:teamId',
    verifyToken,
    validateSchema(schemas.teams.getTeamMembersSchema), 
    async (req: any, res: any) => {
      const team = await TeamsController.getTeamById(req);
      res.json(team);
    }
  );

  /**
   * @swagger
   * /teams:
   *  get:
   *    tags: [Teams]
   *    summary: Get all teams
   *    description: Retrieve a list of all teams
   *    responses:
   *      200:
   *        description: A list of teams
   *      404:
   *        description: Teams not found
   */
  route.get(
    '/',
    verifyToken,
    isSuperAdmin, 
    async (req: any, res: any) => {
      const teams = await TeamsController.getAll();
      res.json(teams);
    }
  );
  
  /**
   * @swagger
   * /teams:
   *   post:
   *     tags: [Teams]
   *     summary: Create a new team
   *     description: Create a new team
   *     requestBody:
   *       required: true
   *     content:
   *       application/json:
   *         schema:
   *           type: object
   *           properties:
   *             name:
   *               type: string
   *             members:
   *               type: array
   *             items:
   *               type: string
   *     responses:
   *       201:
   *         description: A team object
   *       400:
   *         description: Name and members are required
   */
  route.post(
    '/',
    verifyToken,
    validateSchema(schemas.teams.postTeamSchema), 
    async (req: any, res: any) => {
      const newTeam = await TeamsController.createTeam(req);
      res.status(201).json(newTeam);
    });

  /**
   * @swagger
   * /teams/{teamId}:
   *   put:
   *     tags: [Teams]
   *     summary: Update a team
   *     description: Update a team by ID
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: ID of the team to update
   *        schema:
   *          type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *     responses:
   *       200:
   *         description: Team updated
   *       404:
   *         description: Team not found
   */
  route.put(
    '/:id',
    verifyToken,
    validateSchema(schemas.teams.updateTeamSchema), 
    async (req: any, res: any) => {
      const updatedTeam = await TeamsController.updateTeam(req);
      res.json(updatedTeam);
    });

  /**
   * @swagger
   * /teams/{id}:
   *   delete:
   *     tags: [Teams]
   *     summary: Delete a team
   *     description: Delete a team by ID
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: ID of the team to delete
   *        schema:
   *          type: string
   *     responses:
   *       204:
   *         description: Team deleted
   */
  route.delete(
    '/:id',
    verifyToken,
    isTeamAdmin,
    validateSchema(schemas.teams.getTeamSchema), 
    async (req: any, res: any) => {
      await TeamsController.deleteTeam(req);
      res.status(204).json({ message: 'Team deleted' });
    }
  );

  /**
   * @swagger
   * /teams/{teamId}/members:
   *   get:
   *     tags: [Teams]
   *     summary: Get all team members
   *     description: Retrieve a list of all team members
   *     parameters:
   *      - in: path
   *        name: teamId
   *        required: true
   *        description: ID of the team to retrieve members
   *        schema:
   *          type: string
   *     responses:
   *       200:
   *         description: A list of team members
   *       404:
   *         description: Team members not found
   */
  route.get(
    '/:teamId/members',
    verifyToken,
    validateSchema(schemas.teams.getTeamMembersSchema),
    async (req: any, res: any) => {
      const members = await TeamsController.getTeamMembers(req);
      res.json(members);
    }
  );

  /**
   * @swagger
   * /teams/{teamId}/members/{userId}:
   *   post:
   *     tags: [Teams]
   *     summary: Add a member to a team
   *     description: Add a member to a team
   *     parameters:
   *      - in: path
   *        name: teamId
   *        required: true
   *        description: ID of the team to add member
   *        schema:
   *          type: string
   *      - in: path
   *        name: userId
   *        required: true
   *        description: ID of the user to add to the team
   *        schema:
   *          type: string
   *     responses:
   *       201:
   *         description: A team member object
   *       400:
   *         description: Invalid request  
   */
  route.post(
    '/:teamId/members/:userId',
    verifyToken,
    isTeamAdmin,
    validateSchema(schemas.teams.getTeamBothIdsSchema),
    async (req: any, res: any) => {
      const newMember = await TeamsController.addTeamMember(req);
      res.status(201).json(newMember);
    }
  );

  /**
   * @swagger
   * /teams/{teamId}/members/{userId}:
   *   delete:
   *     tags: [Teams]
   *     summary: Remove a member from a team
   *     description: Remove a member from a team
   *     parameters:
   *      - in: path
   *        name: teamId
   *        required: true
   *        description: ID of the team to remove member
   *        schema:
   *          type: string
   *      - in: path
   *        name: userId
   *        required: true
   *        description: ID of the user to remove from the team
   *        schema:
   *          type: string
   *     responses:
   *       204:
   *         description: Member removed
   */
  route.delete(
    '/:teamId/members/:userId',
    verifyToken,
    isTeamAdmin,
    validateSchema(schemas.teams.getTeamBothIdsSchema),
    async (req: any, res: any) => {
      await TeamsController.removeTeamMember(req);
      res.status(204).json({ message: 'Member removed' });
    }
  );

  /**
   * @swagger
   * /teams/{teamId}/members/{userId}:
   *   put:
   *     tags: [Teams]
   *     summary: Update a member role
   *     description: Update a member role
   *     parameters:
   *      - in: path
   *        name: teamId
   *        required: true
   *        description: ID of the team to update member
   *        schema:
   *          type: string
   *      - in: path
   *        name: userId
   *        required: true
   *        description: ID of the user to update role
   *        schema:
   *          type: string
   *     requestBody:
   *       required: true
   *     content:
   *       application/json:
   *         schema:
   *           type: object
   *           properties:
   *             role:
   *               type: string
   *     responses:
   *       200:
   *         description: Member updated
   *       404:
   *         description: Member not found
   */
  route.put(
    '/:teamId/members/:userId',
    verifyToken,
    isTeamAdmin,
    validateSchema(schemas.teams.getTeamBothIdsSchema),
    async (req: any, res: any) => {
      const updatedMember = await TeamsController.updateTeamMember(req);
      res.json(updatedMember);
    }
  );
};