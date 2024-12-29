export interface Schedule {
  id: string;
  teamId: string;
  userId: string;
  startAt: Date;
  endAt: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};