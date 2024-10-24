export type TeamMember = {
  id: string;
  teamId: string;
  userId: string;
  role: string;
  isAvailable: boolean;
  latestOncall?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type NewTeamMember = Omit<TeamMember, 'id'>;

export type TeamMemberUpdate = Partial<TeamMember>;
