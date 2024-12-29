import { Team } from "./Team";

export type TeamSelect = {
  id: string;
  name: string;
  role: string;
};

export type TeamMemberDto = {
  userId: string;
  role: string;
};

export type TeamDto = Team & {
  members: TeamMemberDto[];
};