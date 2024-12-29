import { knex } from '../../../data/providers/KnexProvider';
import { NewTeam } from '../types/Team';
import { NewTeamMember, TeamMember, TeamMemberUpdate } from '../types/TeamMember';

const getTeamMembersTable = () => {
  return knex.table('team_members');
}

const findById = async (id: string): Promise<TeamMember | null> => {
  const teamMember = await getTeamMembersTable().where({ id }).first();
  return teamMember || null;
}

const findDetailedById = async (id: string): Promise<TeamMember | null> => {
  const teamMember = await getTeamMembersTable()
    .join('users', 'team_members.userId', 'users.id')
    .join('teams', 'team_members.teamId', 'teams.id')
    .select(
      'team_members.*', 
      'users.name', 
      'users.email', 
      'users.pushNotificationToken', 
      'teams.name as teamName',
      'teams.notificationType as teamNotificationType',
    )
    .where('users.id', id)
    .first();
  
  return teamMember || null;
}

const findTeamMember = async (teamId: string, userId: string): Promise<TeamMember | null> => {
  const teamMember = await getTeamMembersTable().where({ teamId, userId }).first();
  return teamMember || null;
}

const findTeamMembers = async (teamId: string): Promise<any[]> => {
  const teamMembers = await getTeamMembersTable()
    .where({ teamId })
    .join('users', 'team_members.userId', 'users.id')
    .join('teams', 'team_members.teamId', 'teams.id')
    .select(
      'team_members.*', 
      'users.name', 
      'users.email', 
      'users.pushNotificationToken', 
      'teams.name as teamName',
      'teams.notificationType as teamNotificationType',
    );
  
  return teamMembers;
}

const addTeamMember = async (teamMember: NewTeamMember): Promise<TeamMember> => {
  const [createdTeamMember] = await getTeamMembersTable().insert(teamMember).returning('*');
  return createdTeamMember;
}

const removeTeamMember = async (teamId: string, userId: string): Promise<void> => {
  // TODO: remove schedules, tasks, etc.
  await getTeamMembersTable().where({ teamId, userId }).delete();
}

const updateTeamMember = async (teamId: string, userId: string, updates: TeamMemberUpdate): Promise<void> => {
  const updatedTeamMember = await getTeamMembersTable().where({ teamId, userId }).update(updates);

  if (!updatedTeamMember) {
    throw new Error('Team member not found');
  }

  return;
}

export default {
  findById,
  findDetailedById,
  findTeamMember,
  findTeamMembers,
  addTeamMember,
  removeTeamMember,
  updateTeamMember,
};