import { User } from "../modules/users/types/User";

declare module "express" {
  export interface Request {
    user?: User;
  }
}