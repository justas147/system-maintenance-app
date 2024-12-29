import { TeamSelect } from 'modules/teams/types/TeamDto';
import { knex } from '../../data/providers/KnexProvider'
import { NewUser, User, UserUpdate } from './types/User';
import { v4 as uuid } from 'uuid';

const getUserTable = () => {
  return knex.table('users');
}

const getUserTeamsTable = () => {
  return knex.table('team_members');
}

const findById = async (id: string): Promise<User | null> => {
  const user = await getUserTable().where({ id }).first();
  return user || null;
}

const findByEmail = async (email: string): Promise<User | null> => {
  const user = await getUserTable().where({ email }).first();
  return user || null;
}

const findByUsername = async (username: string): Promise<User | null> => {
  const user = await getUserTable().where({ 
    name: username
   }).first();
  return user || null;
}

const findUserTeams = async (userId: string): Promise<TeamSelect[]> => {
  const teams = await getUserTeamsTable()
    .join('teams', 'team_members.teamId', 'teams.id')
    .where({ userId })
    .select('teams.id as teamId', 'teams.name', 'team_members.role as role');
  
  return teams.map((team) => { 
    return {
      id: team.teamId,
      name: team.name,
      role: team.role,
    }
  });
}

const create = async (user: NewUser): Promise<User | null> => {
  // TODO: fix this
  const id = uuid();
  await getUserTable().insert({
    id,
    ...user,
  });
  const createdUser = await findById(id);
  return createdUser;
}

const findByGoogleId = async (googleId: string): Promise<User | null> => {
  const user = await getUserTable().where({ googleId }).first();
  return user || null;
}

const update = async (id: string, updates: UserUpdate): Promise<any | null> => {
  // TODO: fix this
  await getUserTable().where({ id }).update(updates);
  const updatedUser = await findById(id);

  if (!updatedUser) {
    return null;
  }

  const teamIds = await findUserTeams(id);

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    googleId: updatedUser.googleId,
    teamIds: teamIds,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  };
}

const deleteById = async (id: string): Promise<void> => {
  await getUserTable().where({ id }).delete();
}

export default {
  findById,
  findByEmail,
  findByUsername,
  findUserTeams,
  create,
  findByGoogleId,
  update,
  deleteById,
};