import Joi from 'joi';
import { RequestValidationSchema } from './types/Schema';

const getAlertsSchema: RequestValidationSchema = {
  params: Joi.object({
    id: Joi.string().guid().required(),
  }),
};

const getUserAlertsSchema: RequestValidationSchema = {
  params: Joi.object({
    userId: Joi.string().guid().required(),
  }),
};

const postAlertSchema: RequestValidationSchema  = {
  body: Joi.object({
    alertMessage: Joi.string(),
    alertSource: Joi.string(),
    alertTime: Joi.date(),
    alertType: Joi.string(),
  }),
};

const updateAlertSchema: RequestValidationSchema = {
  body: Joi.object({
    alertMessage: Joi.string(),
    alertSource: Joi.string(),
    alertTime: Joi.date(),
    alertType: Joi.string(),
    isEscalated: Joi.boolean(),
    responseDeadline: Joi.date(),
  }),
  params: Joi.object({
    id: Joi.string().guid().required(),
  }),
};

export default {
  getAlertsSchema,
  getUserAlertsSchema,
  postAlertSchema,
  updateAlertSchema,
}
