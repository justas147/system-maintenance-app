export type Alert = {
  id: string;
  teamId: string;
  handledBy: string;
  alertMessage: string;
  alertSource: string;
  alertTime: Date;
  alertType: string;
  isHandled: boolean;
  isEscalated: boolean;
  responseDeadline?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export type NewAlert = Omit<Alert, 'id'>;

export type AlertUpdate = Partial<Alert>;