export type TeamMember = {
  id: string;
  teamId: string;
  userId: string;
  role: string;
  color?: string;
  isAvailable: boolean;
  lastOnCall?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type NewTeamMember = Omit<TeamMember, 'id'>;

export type TeamMemberUpdate = Partial<TeamMember>;
