import { Router } from 'express';
import { UserRoutes } from './users';
import { AuthRoutes } from './auth';
import { AlertRoutes } from './alerts';
import { TeamRoutes } from './teams';
import { ScheduleRoutes } from './schedules';

export const routes = (): Router => {
  const router = Router();

  AlertRoutes(router);
  AuthRoutes(router);
  ScheduleRoutes(router);
  TeamRoutes(router);
  UserRoutes(router);

  return router;
};
