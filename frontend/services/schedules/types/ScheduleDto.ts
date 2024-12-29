export interface SelecetdSchedule {
  id: string;
  teamId: string;
  userId: string;
  startAt: Date;
  endAt: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  userName?: string;
  teamName?: string;
  userEmail?: string;
  teamRole?: string;
  teamColor?: string;
};

export type NewSchedule = {
  teamId: string;
  userId: string;
  isActive: boolean;
  startAt: Date;
  endAt: Date;
}

export type DateMark = {
  id: string;
  date: Date;
  color: string;
  startingDay?: boolean;
  endingDay?: boolean;
}

export type MarkedDates = {
  [date: string]: DateMark;
}

export type MarkedDateUser = {
  id: string;
  color: string;
  name: string;
  role: string;
  lastOnCall?: Date;
}

export type MarkedDateUsers = {
  [userId: string]: MarkedDateUser;
}

export type MarkedDatesResponse = {
  markedDates: MarkedDates;
  markedDateUsers: MarkedDateUsers;
}
