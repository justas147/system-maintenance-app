import { Request } from "express";
import { HttpError } from "../../core/errorHandler";
import TeamData from "./data/TeamData";
import TeamMemberData from "./data/TeamMemberData";
import { pick } from "../../utils/sanitizerUtils";
import TeamsService from "./TeamsService";
import { TeamMember } from "./types/TeamMember";
import { Team } from "./types/Team";

const getAll = async () => {
  const teams = await TeamData.findAll();
  return teams;
}

const getTeamById = async (req: Request): Promise<Team> => {
  const { teamId } = req.params;
  const team = await TeamData.findTeamById(teamId);

  if (!team) {
    throw new HttpError(404, 'Team not found');
  }

  return team;
}

const createTeam = async (req: Request): Promise<Team> => {
  const { name, members } = req.body;

  if (!name || !members) {
    throw new HttpError(400, 'Name and members are required');
  }

  const newTeam = await TeamData.createTeam({ name });
  return newTeam;
}

const getUserTeam = async (req: Request): Promise<Team> => {
  const { userId, teamId } = req.params;
  const team = await TeamData.findTeam(teamId, userId);

  if (!team) {
    throw new HttpError(404, 'Team not found');
  }

  return team;
}

const updateTeam = async (req: Request): Promise<Team> => {
  const { teamId } = req.params;
  const { name } = req.body;

  const updatedTeam = await TeamData.updateTeam(teamId, { name });
  return updatedTeam;
}

const deleteTeam = async (req: Request): Promise<void> => {
  const { teamId } = req.params;
  await TeamData.deleteTeam(teamId);
}

const getTeamMembers = async (req: Request): Promise<TeamMember[]> => {
  const { teamId } = req.params;
  const members = await TeamMemberData.findTeamMembers(teamId);
  return members;
}

const addTeamMember = async (req: Request): Promise<TeamMember> => {
  const { teamId, userId } = req.params;
  const addTeamMember = pick(req.body, [
    'role',
    'isAvailable',
  ]);

  return await TeamsService.createTeamMember({ teamId, userId, ...addTeamMember });
}

const removeTeamMember = async (req: Request): Promise<void> => {
  const { teamId, userId } = req.params;
  await TeamMemberData.removeTeamMember(teamId, userId);
}

const updateTeamMember = async (req: Request): Promise<TeamMember> => {
  const { teamId, userId } = req.params;
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