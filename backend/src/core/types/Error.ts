import { Response } from "express";
import { Status } from "./Status";

export type HandleErrorProps = {
  err: Error & Status;
  res: Response;
};

export interface ErrorMessage {
  message: string;
}

export interface ErrorResponse {
  errors: ErrorMessage;
}
