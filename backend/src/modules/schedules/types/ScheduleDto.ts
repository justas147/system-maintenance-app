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
