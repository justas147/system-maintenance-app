import { HttpError } from "../../core/errorHandler";
import { Request } from "express";
import AlertData from "./AlertData";
import AlertsService from "./AlertsService";
import { Alert } from "./types/Alert";
import { pick } from "../../utils/sanitizerUtils";

const getUserAlerts = async (req: Request): Promise<Alert[]> => {
  const { userId } = req.params;

  try {
    const alerts = AlertData.findAlertByUserId(userId);
    return alerts;
  } catch (err) {
    throw new HttpError(500, 'Server error');
  }
}

const getAlertById = async (req: Request): Promise<Alert> => {
  const { id } = req.params;

  let alert;
  try {
    alert = AlertData.findAlertById(id);
  } catch (err) {
    throw new HttpError(500, 'Server error');
  }

  if (!alert) {
    throw new HttpError(404, 'Alert not found');
  }

  return alert;
}

const acknowledgeAlert = async (req: Request): Promise<Alert> => {
  const { id } = req.params;

  let alert;
  try {
    alert = AlertData.findAlertById(id);
  } catch (err) {
    throw new HttpError(500, 'Server error');
  }

  if (!alert) {
    throw new HttpError(404, 'Alert not found');
  }

  await AlertData.acknowledgeAlert(id);
  return alert;
}

const escalateAlert = async (req: Request): Promise<Alert> => {
  const { id } = req.params;
  const escalatedAlert = await AlertsService.escalateAlert(id);
  return escalatedAlert;
};

const createAlert = async (req: Request): Promise<Alert> => {
  const { userId, teamId } = req.params;
  const newAlert = pick(req.body, [
    'alertMessage',
    'alertSource',
    'alertTime',
    'alertType',
  ]);

  try {
    const alert = await AlertData.createAlert({ 
      ...newAlert, 
      handledBy: userId, 
      teamId, 
      isHandled: false, 
      isEscalated: false
    });
    return alert;
  } catch (err) {
    throw new HttpError(500, 'Server error');
  }
}

const updateAlert = async (req: Request): Promise<Alert> => {
  const { id } = req.params;
  const alertUpdate = pick(req.body, [
    'alertMessage',
    'alertSource',
    'alertTime',
    'alertType',
    'isHandled',
    'isEscalated',
  ]);

  try {
    const updatedAlert = await AlertData.updateAlert(id, alertUpdate);
    return updatedAlert;
  } catch (err) {
    throw new HttpError(500, 'Server error');
  }
}

const deleteAlert = async (req: Request): Promise<void> => {
  const { id } = req.params;

  try {
    await AlertData.deleteAlert(id);
  } catch (err) {
    throw new HttpError(500, 'Server error');
  }
}

export default {
  getUserAlerts,
  getAlertById,
  acknowledgeAlert,
  escalateAlert,
  createAlert,
  updateAlert,
  deleteAlert,
};