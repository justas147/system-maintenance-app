import { RequestValidationSchema } from "../schemas/types/Schema";
import { ValidationError, ValidationOptions } from "joi";

const mergeValidationOptions = (providedOptions?: ValidationOptions): ValidationOptions => {
  const defaultValidationOptions = {
    abortEarly: true,
    allowUnknown: false,
    stripUnknown: true,
  };
  return { ...defaultValidationOptions, ...providedOptions };
};

export const validateSchema = (
  schema: RequestValidationSchema,
  providedOptions?: ValidationOptions,
): ((req, res, next) => void) => {
  return (req, res, next) => {
    const parameters = ["params", "body", "query"];

    for (const param of parameters) {
      if (schema[param] === undefined) {
        continue;
      }

      const { value, error }: { value: unknown; error?: ValidationError } = schema[param].validate(
        req[param],
        mergeValidationOptions(providedOptions),
      );

      if (error) {
        const response = {
          errors: {
            message: error.details?.[0]?.message?.replace(/['"]/g, "") ?? "Invalid request data",
          },
        };

        res.status(400).json(response);

        return;
      }

      // assign processed value to request param
      req[param] = value;
    }

    // no error, can continue
    next();
  };
};
