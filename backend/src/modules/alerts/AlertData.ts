import { knex } from '../../data/providers/KnexProvider';
import { Alert, AlertUpdate, NewAlert } from './types/Alert';

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
  const alerts = await getAlertTable().where({ teamId, userId });
  return alerts;
}

const createAlert = async (alert: NewAlert): Promise<Alert> => {
  const [createdAlert] = await getAlertTable().insert(alert).returning('*');
  return createdAlert;
}

const updateAlert = async (alertId: string, updates: AlertUpdate): Promise<Alert> => {
  const [updatedAlert] = await getAlertTable().where({ id: alertId }).update(updates).returning('*');
  return updatedAlert;
}

const deleteAlert = async (alertId: string): Promise<void> => {
  await getAlertTable().where({ id: alertId }).delete();
}

const acknowledgeAlert = async (alertId: string): Promise<void> => {
  await getAlertTable().where({ id: alertId }).update({ isHandled: true });
}

// TODO: Think of ways to improve alert check to scale better...
const findUnacknowledgedAlerts = async (date: Date): Promise<Alert[]> => {
  const alerts = await getAlertTable()
    .where('isHandled', false)
    .andWhere('responseDeadline', '<', date)
    .andWhere('escalated', false);

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