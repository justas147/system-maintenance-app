import { Request, Response, NextFunction } from 'express';
import TeamMembersData from '../modules/teams/data/TeamMemberData';
import { UserRole } from '../modules/teams/types/Roles';
import { HttpError } from '../core/errorHandler';

export const isTeamAdmin = async (req: Request, res: Response, next: NextFunction) => {

  if (!req.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  const userId = req.user?.id;
  const { teamId } = req.params;

  if (!userId || !teamId) {
    throw new HttpError(400, 'User ID and team ID are required');
  }

  const member = await TeamMembersData.findTeamMember(userId, teamId);

  if (!member || member.role !== UserRole.ADMIN) {
    throw new HttpError(403, 'You are not authorized to perform this action');
  }

  next();
};