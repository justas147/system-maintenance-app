import { ErrorMessage, ErrorResponse, HandleErrorProps } from "./types/Error";
import { Status } from "./types/Status";

export class HttpError extends Error {
  private statusCode: Status | number;
  
  constructor(statusCode: Status | number, message: ErrorMessage | string) {
    super();
    this.statusCode = statusCode;
    this.message = message ? message.toString() : "Internal server error"
  }
}

const TEXT = {
  INTERNAL_SERVER_ERROR: "Internal server error",
  GENERIC_ERROR: "Error has occured",
};

export const handleError = ({ err, res }: HandleErrorProps): void => {
  const { statusCode, message } = err;

  let responseMessage: string = message;
  if (process.env.NODE_ENV === "production" && (!statusCode || statusCode >= 500)) {
    responseMessage = TEXT.GENERIC_ERROR;
  }

  const errorResponse: ErrorResponse = {
    errors: {
      message: responseMessage,
    },
  };

  res.status(statusCode || 500);
  res.json(errorResponse);
};
