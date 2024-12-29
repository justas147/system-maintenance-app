import Joi from 'joi';
import { RequestValidationSchema } from './types/Schema';

const getScheduleSchema: RequestValidationSchema = {
  params: Joi.object({
    id: Joi.string().guid().required(),
  }),
};

const getTeamUserScheduleSchema: RequestValidationSchema = {
  params: Joi.object({
    teamId: Joi.string().guid().required(),
    userId: Joi.string().guid().required(),
  }),
};

const getUserScheduleSchema: RequestValidationSchema = {
  params: Joi.object({
    userId: Joi.string().guid().required(),
  }),
};

const getTeamScheduleSchema: RequestValidationSchema = {
  params: Joi.object({
    teamId: Joi.string().guid().required(),
  }),
};

const postScheduleSchema: RequestValidationSchema = {
  body: Joi.object({
    isActive: Joi.boolean(),
    startAt: Joi.date().required(),
    endAt: Joi.date().required(),
    teamId: Joi.string().guid().required(),
    userId: Joi.string().guid().required(),
  }),
};

const updateScheduleSchema: RequestValidationSchema = {
  body: Joi.object({
    isActive: Joi.boolean(),
    startAt: Joi.date().required(),
    endAt: Joi.date().required(),
  }),
  params: Joi.object({
    id: Joi.string().guid().required(),
  }),
};

export default {
  getScheduleSchema,
  getTeamUserScheduleSchema,
  getUserScheduleSchema,
  getTeamScheduleSchema,
  postScheduleSchema,
  updateScheduleSchema,
}