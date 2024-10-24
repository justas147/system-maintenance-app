import { knex } from '../../data/providers/KnexProvider'
import { NewUser, User, UserUpdate } from './types/User';

const getUserTable = () => {
  return knex.table('users');
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

const create = async (user: NewUser): Promise<User> => {
  const [createdUser] = await getUserTable().insert(user).returning('*');
  return createdUser;
}

const findByGoogleId = async (googleId: string): Promise<User | null> => {
  const user = await getUserTable().where({ googleId }).first();
  return user || null;
}

const update = async (id: string, updates: UserUpdate): Promise<User> => {
  const [updatedUser] = await getUserTable().where({ id }).update(updates).returning('*');
  return updatedUser;
}

const deleteById = async (id: string): Promise<void> => {
  await getUserTable().where({ id }).delete();
}

export default {
  findById,
  findByEmail,
  findByUsername,
  create,
  findByGoogleId,
  update,
  deleteById,
};