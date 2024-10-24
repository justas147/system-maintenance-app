import { Request, Response, NextFunction } from 'express';
import TeamMembersData from '../modules/teams/data/TeamMemberData';
import { HttpError } from '../core/errorHandler';

export const teamMemberMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.user?.id;
  const { teamId } = req.params;

  if (!userId || !teamId) {
    throw new HttpError(400, 'Invalid request');
  }

  const member = await TeamMembersData.findTeamMember(userId, teamId);

  if (!member) {
    throw new HttpError(403, 'You are not a member of this team');
  }

  next();
}