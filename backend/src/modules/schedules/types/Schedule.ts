export type Schedule = {
  id: string;
  teamId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export type NewSchedule = Omit<Schedule, 'id'>;

export type ScheduleUpdate = Partial<Schedule>;