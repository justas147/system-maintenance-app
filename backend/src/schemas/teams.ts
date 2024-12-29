import Joi from 'joi';
import { RequestValidationSchema } from './types/Schema';
import { NotificationType } from 'modules/teams/types/Team';

const getTeamSchema: RequestValidationSchema = {
  params: Joi.object({
    id: Joi.string().guid().required(),
  }),
};

const getUserTeamSchema: RequestValidationSchema = {
  params: Joi.object({
    userId: Joi.string().guid().required(),
  }),
};

const getTeamMembersSchema: RequestValidationSchema = {
  params: Joi.object({
    teamId: Joi.string().guid().required(),
  }),
};

const getTeamBothIdsSchema: RequestValidationSchema = {
  params: Joi.object({
    teamId: Joi.string().guid().required(),
    userId: Joi.string().guid().required(),
  }),
};

const postTeamSchema: RequestValidationSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    configuration: Joi.string(),
  }),
};

const updateTeamSchema: RequestValidationSchema = {
  body: Joi.object({
    name: Joi.string(),
    notificationType: Joi.string(),
  }),
  params: Joi.object({
    id: Joi.string().guid().required(),
  }),
};

export default {
  getTeamSchema,
  getUserTeamSchema,
  postTeamSchema,
  updateTeamSchema,
  getTeamMembersSchema,
  getTeamBothIdsSchema,
}