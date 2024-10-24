import { AlternativesSchema, ArraySchema, ObjectSchema } from "joi";

export type RequestValidationSchema = {
  params?: ObjectSchema;
  query?: ObjectSchema;
  body?: ObjectSchema | ArraySchema | AlternativesSchema;
};

