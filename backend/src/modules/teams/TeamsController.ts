import { Request } from "express";
import { HttpError } from "../../core/errorHandler";
import TeamData from "./data/TeamData";
import TeamMemberData from "./data/TeamMemberData";
import { pick } from "../../utils/sanitizerUtils";
import TeamsService from "./TeamsService";
import { TeamMember } from "./types/TeamMember";
import { Team } from "./types/Team";
import { TeamDto } from "./types/TeamDto";

const getAll = async () => {
  console.log('Getting all teams');
  const teams = await TeamData.findAll();
  return teams;
}

const getTeamById = async (req: Request): Promise<TeamDto> => {
  const { teamId } = req.params;
  console.log(`Getting team: ${teamId}`);

  const team = await TeamData.findTeamById(teamId);

  const members = await TeamMemberData.findTeamMembers(teamId);

  if (!team) {
    throw new HttpError(404, 'Team not found');
  }

  return {
    ...team,
    members,
  };
}

const createTeam = async (req: Request): Promise<Team> => {
  const { name, notificationType, userId } = req.body;

  if (!name) {
    throw new HttpError(400, 'Name and members are required');
  }

  if (!userId) {
    throw new HttpError(400, 'User id is required');
  }

  const newTeam = await TeamData.createTeam({ name });

  const newTeamMember = await TeamsService.createTeamMember({
    teamId: newTeam.id,
    userId,
    role: 'owner',
    isAvailable: true,
  });

  console.log(`Creating team: ${newTeam.id}`);

  return newTeam;
}

const getUserTeam = async (req: Request): Promise<Team[]> => {
  const { userId } = req.params;
  console.log(`Getting user teams: ${userId}`);
  const team = await TeamData.findUserTeams(userId);

  if (!team) {
    throw new HttpError(404, 'Team not found');
  }

  return team;
}

const updateTeam = async (req: Request): Promise<Team> => {
  const { teamId } = req.params;
  const { name } = req.body;
  console.log(`Updating team: ${teamId}`);
  const updatedTeam = await TeamData.updateTeam(teamId, { name });
  return updatedTeam;
}

const deleteTeam = async (req: Request): Promise<void> => {
  const { teamId } = req.params;
  console.log(`Deleting team: ${teamId}`);
  await TeamData.deleteTeam(teamId);
}

const getTeamMembers = async (req: Request): Promise<TeamMember[]> => {
  const { teamId } = req.params;
  console.log(`Getting team members: ${teamId}`);
  const members = await TeamMemberData.findTeamMembers(teamId);
  return members;
}

const addTeamMember = async (req: Request): Promise<TeamMember> => {
  const { teamId, userId } = req.params;
  console.log(`Adding team member: ${userId} to team: ${teamId}`);
  const addTeamMember = pick(req.body, [
    'role',
    'isAvailable',
  ]);

  return await TeamsService.createTeamMember({ teamId, userId, ...addTeamMember });
}

const removeTeamMember = async (req: Request): Promise<void> => {
  const { teamId, userId } = req.params;
  console.log(`Removing team member: ${userId} from team: ${teamId}`);
  await TeamMemberData.removeTeamMember(teamId, userId);
}

const updateTeamMember = async (req: Request): Promise<TeamMember> => {
  const { teamId, userId } = req.params;
  console.log(`Updating team member: ${userId} in team: ${teamId}`);
  const updateTeamMember = pick(req.body, [
    'role',
    'isAvailable',
  ]);

  return await TeamsService.updateTeamMember(teamId, userId, updateTeamMember);
}

export default {
  getAll,
  getTeamById,
  createTeam,
  updateTeam,
  getUserTeam,
  deleteTeam,
  getTeamMembers,
  addTeamMember,
  removeTeamMember,
  updateTeamMember,
};