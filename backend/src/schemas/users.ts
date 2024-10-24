import Joi from 'joi';
import { RequestValidationSchema } from './types/Schema';

const getUserSchema: RequestValidationSchema = {
  params: Joi.object({
    id: Joi.string().guid().required(),
  }),
};

const postUserSchema: RequestValidationSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const updateUserSchema: RequestValidationSchema = {
  body: Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    googleId: Joi.string(),
  }),
  params: Joi.object({
    id: Joi.string().guid().required(),
  }),
};

const registerUserSchema: RequestValidationSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export default {
  getUserSchema,
  postUserSchema,
  updateUserSchema,
  registerUserSchema,
}