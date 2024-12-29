import { knex } from '../../../data/providers/KnexProvider';
import { NewTeam, Team, TeamUpdate } from '../types/Team';

const getTeamMembersTable = () => {
  return knex.table('teams');
}

const findAll = async (): Promise<Team[]> => {
  const teams = await getTeamMembersTable().select('*');
  return teams;
}

const findTeam = async (teamId: string, userId: string): Promise<Team | null> => {
  const team = await getTeamMembersTable().where({ teamId, userId }).first();
  return team || null;
};

const findUserTeams = async (userId: string): Promise<Team[]> => {
  const teams = await getTeamMembersTable()
    .join('team_members', 'teams.id', 'team_members.team_id')
    .where('team_members.user_id', userId)
    .select('teams.*');

  return teams;
}

const findTeamById = async (teamId: string): Promise<Team | null> => {
  const team = await getTeamMembersTable().where({ id: teamId }).first();
  return team || null;
}

const createTeam = async (team: NewTeam): Promise<Team> => {
  const [createdTeam] = await getTeamMembersTable().insert(team).returning('*');
  return createdTeam;
}

const updateTeam = async (teamId: string, updates: TeamUpdate): Promise<Team> => {
  const updatedTeam = await getTeamMembersTable().where({ id: teamId }).update(updates);

  if (!updatedTeam) {
    throw new Error('Team not found');
  }

  const team = await findTeamById(teamId);

  if (!team) {
    throw new Error('Team not found');
  }

  return team;
}

const deleteTeam = async (teamId: string): Promise<void> => {
  await getTeamMembersTable().where({ id: teamId }).delete();
}

export default {
  findAll,
  findTeam,
  findTeamById,
  findUserTeams,
  createTeam,
  updateTeam,
  deleteTeam,
};