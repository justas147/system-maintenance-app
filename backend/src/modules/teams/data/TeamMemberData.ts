import { knex } from '../../../data/providers/KnexProvider';
import { NewTeam } from '../types/Team';
import { NewTeamMember, TeamMember, TeamMemberUpdate } from '../types/TeamMember';

const getTeamMembersTable = () => {
  return knex.table('team_members');
}

const findTeamMember = async (teamId: string, userId: string): Promise<TeamMember | null> => {
  const teamMember = await getTeamMembersTable().where({ teamId, userId }).first();
  return teamMember || null;
}

const findTeamMembers = async (teamId: string): Promise<TeamMember[]> => {
  const teamMembers = await getTeamMembersTable().where({ teamId });
  return teamMembers;
}

const addTeamMember = async (teamMember: NewTeamMember): Promise<TeamMember> => {
  const [createdTeamMember] = await getTeamMembersTable().insert(teamMember).returning('*');
  return createdTeamMember;
}

const removeTeamMember = async (teamId: string, userId: string): Promise<void> => {
  await getTeamMembersTable().where({ teamId, userId }).delete();
}

const updateTeamMember = async (teamId: string, userId: string, updates: TeamMemberUpdate): Promise<TeamMember> => {
  const [updatedTeamMember] = await getTeamMembersTable().where({ teamId, userId }).update(updates).returning('*');
  return updatedTeamMember;
}

export default {
  findTeamMember,
  findTeamMembers,
  addTeamMember,
  removeTeamMember,
  updateTeamMember,
};