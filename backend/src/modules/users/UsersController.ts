import { Request } from "express";
import { HttpError } from "../../core/errorHandler";
import UsersData from "./UsersData";
import bcrypt from "bcryptjs";
import { pick } from "../../utils/sanitizerUtils";
import { User } from "./types/User";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const login = async (req: Request): Promise<any> => {
  const { email, password } = req.body;

  console.info(`Logging in user: ${email}`);

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

  // TODO: instead of long lasting token, use short lived token and refresh token
  const token = jwt.sign(
    { id: user.id }, 
    process.env.JWT_SECRET!, 
    { expiresIn: process.env.JWT_EXPIRES_IN ?? '30d' }
  );
  return { message: 'Login successful', token };
}

const register = async (req: Request): Promise<User> => {
  console.log(`Registering user: ${JSON.stringify(req.body)}`);
  const { name, password, email, pushNotificationToken } = req.body;

  try {
    const existingUser = await UsersData.findByEmail(email);
    if (existingUser) {
      throw new HttpError(400, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    if (pushNotificationToken) {
      console.log(`Push notification token: ${pushNotificationToken}`);
      newUser = await UsersData.create({ name, email, password: hashedPassword, pushNotificationToken });
    } else {
      newUser = await UsersData.create({ name, email, password: hashedPassword });
    }

    if (!newUser) {
      throw new HttpError(500, 'Server error');
    }

    // TODO: move this to a service, add sparkpost
    const transporter = nodemailer.createTransport({
      host: "mailhog",
      port: "1025",
    });

    await transporter.sendMail({
      from: 'app@my-app.com',
      to: email,
      subject: 'Welcome to our platform',
      text: `Hello ${name}, welcome to our platform!`,
    });

    return newUser;
  } catch (err) {
    throw new HttpError(500, err.message);
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

    if (!createdUser) {
      throw new HttpError(500, 'Server error');
    }

    return createdUser;
  } catch (err) {
    throw new HttpError(500, 'Server error');
  }
};

const update = async (req: Request): Promise<User> => {
  const { id } = req.params;
  console.log(`Updating user: ${id}`);
  const userUpdate = pick(req.body, [
    'name', 
    'email',
    'googleId',
  ]);

  try {
    const updatedUser = await UsersData.update(id, userUpdate);

    if (!updatedUser) {
      throw new HttpError(500, 'Server error');
    }

    return updatedUser;
  } catch (err) {
    throw new HttpError(500, 'Server error');
  }
};

const deleteUser = async (req: Request): Promise<void> => {
  const { id } = req.params;
  console.log(`Deleting user: ${id}`);
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
