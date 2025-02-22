export const NotificationType = {
  PUSH_NOTIFICATION: 'push-notification',
  ALARM: 'alarm',
} as const;

export type Team = {
  id: string;
  name: string;
  configuration?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export type NewTeam = Omit<Team, 'id'>;

export type TeamUpdate = Partial<Team>;
