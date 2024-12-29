import { HttpError } from "../../core/errorHandler";
import e, { Request } from "express";
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
    throw new HttpError(500, err.message);
  }
}

const getTeamUserAlerts = async (req: Request): Promise<Alert[]> => {
  const { userId, teamId } = req.params;

  try {
    const alerts = AlertData.findAlertByTeamIdAndUserId(teamId, userId);
    return alerts;
  } catch (err) {
    throw new HttpError(500, err.message);
  }
}

const getAlertsByTeam = async (req: Request): Promise<Alert[]> => {
  const { teamId } = req.params;

  try {
    const alerts = AlertData.findAlertByTeamId(teamId);
    return alerts;
  } catch (err) {
    throw new HttpError(500, err.message);
  }
}

const getAlertById = async (req: Request): Promise<Alert> => {
  const { id } = req.params;

  let alert;
  try {
    alert = AlertData.findAlertById(id);
  } catch (err) {
    throw new HttpError(500, err.message);
  }

  if (!alert) {
    throw new HttpError(404, 'Alert not found');
  }

  return alert;
}

const acknowledgeAlert = async (req: Request): Promise<Alert> => {
  const { id } = req.params;

  console.log('Acknowledging alert', id);
  let alert;
  try {
    alert = AlertData.findAlertById(id);

    if (!alert) {
      throw new HttpError(404, 'Alert not found');
    }
  
    const updateAlert = await AlertData.acknowledgeAlert(id);
  
    if (!updateAlert) {
      throw new HttpError(500, "Failed to acknowledge alert");
    }
  
    console.log('Alert acknowledged', updateAlert);
    return updateAlert;
  } catch (err) {
    if (err instanceof HttpError) {
      throw err;
    }
    throw new HttpError(500, err.message);
  }
}

const escalateAlert = async (req: Request): Promise<Alert> => {
  const { id } = req.params;
  const escalatedAlert = await AlertsService.escalateAlert(id);
  return escalatedAlert;
};

const createAlert = async (req: Request): Promise<Alert> => {
  const { teamId } = req.params;
  console.log('Creating alert for team', teamId);

  try {
    const newAlert = pick(req.body, [
      'alertMessage',
      'alertTitle',
      'alertSource',
      'alertTime',
      'alertType',
    ]);

    const alert = await AlertData.createAlert({
      ...newAlert,
      teamId, 
      isHandled: false, 
      isEscalated: false
    });

    await AlertsService.alertCurrentOnCall(alert);

    return alert;
  } catch (err) {
    throw new HttpError(500, err.message);
  }
}

const updateAlert = async (req: Request): Promise<Alert> => {
  const { id } = req.params;
  const alertUpdate = pick(req.body, [
    'alertMessage',
    'alertTitle',
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
    throw new HttpError(500, err.message);
  }
}

const deleteAlert = async (req: Request): Promise<void> => {
  const { id } = req.params;

  try {
    await AlertData.deleteAlert(id);
  } catch (err) {
    throw new HttpError(500, err.message);
  }
}

export default {
  getUserAlerts,
  getTeamUserAlerts,
  getAlertsByTeam,
  getAlertById,
  acknowledgeAlert,
  escalateAlert,
  createAlert,
  updateAlert,
  deleteAlert,
};