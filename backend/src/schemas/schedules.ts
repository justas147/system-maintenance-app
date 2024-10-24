import Joi from 'joi';
import { RequestValidationSchema } from './types/Schema';

const getScheduleSchema: RequestValidationSchema = {
  params: Joi.object({
    id: Joi.string().guid().required(),
  }),
};

const getUserScheduleSchema: RequestValidationSchema = {
  params: Joi.object({
    usedId: Joi.string().guid().required(),
  }),
};

const getTeamScheduleSchema: RequestValidationSchema = {
  params: Joi.object({
    usedId: Joi.string().guid().required(),
  }),
};

const postScheduleSchema: RequestValidationSchema = {
  body: Joi.object({
    isActive: Joi.boolean(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
  }),
};

const updateScheduleSchema: RequestValidationSchema = {
  body: Joi.object({
    isActive: Joi.boolean(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
  }),
  params: Joi.object({
    id: Joi.string().guid().required(),
  }),
};

export default {
  getScheduleSchema,
  getUserScheduleSchema,
  getTeamScheduleSchema,
  postScheduleSchema,
  updateScheduleSchema,
}