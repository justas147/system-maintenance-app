import { Request } from "express";
import { HttpError } from "../../core/errorHandler";
import UsersData from "./UsersData";
import bcrypt from "bcrypt";
import { pick } from "../../utils/sanitizerUtils";
import { User } from "./types/User";
import jwt from 'jsonwebtoken';

const login = async (req: Request): Promise<any> => {
  const { email, password } = req.body;

  let user;
  try {
    user = await UsersData.findByEmail(email);
  } catch (err) {
    throw new HttpError(500, 'Server error 1');
  }

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  if (!user.password) {
    throw new HttpError(401, 'Invalid credentials');
  }

  try {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpError(401, 'Invalid credentials');
    }
  } catch (err) {
    throw new HttpError(500, 'Server error 2');
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  return { message: 'Login successful', token };
}

const register = async (req: Request): Promise<User> => {
  const { username: name, password, email } = req.body;

  try {
    const existingUser = await UsersData.findByEmail(email);
    if (existingUser) {
      throw new HttpError(400, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UsersData.create({ name, email, password: hashedPassword });

    return newUser;
  } catch (err) {
    throw new HttpError(500, 'Server error');
  }
};

const getById = async (req: Request): Promise<User> => {
  const { id } = req.params;

  let user;
  try {
    user = await UsersData.findById(id);
  } catch (err) {
    throw new HttpError(500, 'Server error');
  }

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  return user;
};

const create = async (req: Request): Promise<User> => {
  const newUser = pick(req.body, [
    'name', 
    'email'
  ]);

  try {
    const createdUser = await UsersData.create(newUser);
    return createdUser;
  } catch (err) {
    throw new HttpError(500, 'Server error');
  }
};

const update = async (req: Request): Promise<User> => {
  const { id } = req.params;
  const userUpdate = pick(req.body, [
    'name', 
    'email',
    'googleId',
  ]);

  try {
    const updatedUser = await UsersData.update(id, userUpdate);
    return updatedUser;
  } catch (err) {
    throw new HttpError(500, 'Server error');
  }
};

const deleteUser = async (req: Request): Promise<void> => {
  const { id } = req.params;

  try {
    await UsersData.deleteById(id);
  } catch (err) {
    throw new HttpError(500, 'Server error');
  }
};

export default {
  login,
  register,
  create,
  update,
  getById,
  deleteUser,
};
