import { knex } from '../../data/providers/KnexProvider';
import { Alert, AlertUpdate, NewAlert } from './types/Alert';
import { v4 as uuid } from 'uuid';

const getAlertTable = () => {
  return knex.table('alerts');
}

const findAll = async (): Promise<Alert[]> => {
  const alerts = await getAlertTable().select('*');
  return alerts;
}

const findAlertById = async (alertId: string): Promise<Alert | null> => {
  const alert = await getAlertTable().where({ id: alertId }).first();
  return alert || null;
}

const findAlertByUserId = async (userId: string): Promise<Alert[]> => {
  const alerts = await getAlertTable().where({ handledBy: userId });
  return alerts;
}

const findAlertByTeamId = async (teamId: string): Promise<Alert[]> => {
  const alerts = await getAlertTable().where({ teamId });
  return alerts;
}

const findAlertByTeamIdAndUserId = async (teamId: string, userId): Promise<Alert[]> => {
  const alerts = await getAlertTable().where({ teamId, handledBy: userId });
  return alerts;
}

const createAlert = async (alert: NewAlert): Promise<Alert> => {
  const id = uuid();

  // repose deadline is 5 minutes from now
  const responseDeadline = new Date();
  responseDeadline.setMinutes(responseDeadline.getMinutes() + 1);
  const createdAlertId = await getAlertTable().insert({
    id,
    responseDeadline,
    ...alert,
  });

  console.log('Created alert wiht id', id);
  if (!createdAlertId) {
    throw new Error('Failed to create alert');
  }

  const createdAlert = await findAlertById(id);

  console.log('Found created alert', createdAlert);
  if (!createdAlert) {
    throw new Error('Failed to find the created alert');
  }

  return createdAlert;
}

const updateAlert = async (alertId: string, updates: AlertUpdate): Promise<Alert> => {
  const updatedAlert = await getAlertTable().where({ id: alertId }).update(updates);

  if (!updatedAlert) {
    throw new Error('Failed to update');
  }

  const alert = await findAlertById(alertId);

  if (!alert) {
    throw new Error('Failed to find the updated alert');
  }

  return alert;
}

const deleteAlert = async (alertId: string): Promise<void> => {
  await getAlertTable().where({ id: alertId }).delete();
}

const acknowledgeAlert = async (alertId: string): Promise<Alert | null> => {
  await getAlertTable().where({ id: alertId }).update({ isHandled: true });
  const alert = await findAlertById(alertId);
  return alert;
}

// TODO: Think of ways to improve alert check to scale better...
const findUnacknowledgedAlerts = async (date: Date): Promise<Alert[]> => {
  const alerts = await getAlertTable()
    .where('isHandled', false)
    .andWhere('responseDeadline', '<', date)
    .andWhere('isEscalated', false);

  return alerts;
}

export default {
  findAll,
  findAlertById,
  findAlertByUserId,
  findAlertByTeamId,
  findAlertByTeamIdAndUserId,
  createAlert,
  updateAlert,
  deleteAlert,
  acknowledgeAlert,
  findUnacknowledgedAlerts,
};