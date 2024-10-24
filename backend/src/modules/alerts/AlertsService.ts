import AlertData from "./AlertData";
import moment from "moment";
import TeamsService from "../../modules/teams/TeamsService";
import { Alert } from "./types/Alert";
import { TeamMember } from "../../modules/teams/types/TeamMember";

const sendAlertNotification = async (user: TeamMember, alert: Alert) => {
  // TODO: Implement notification sending to mobile app or other channel
  // Push notification can be implemented with react-native-firebase:
  // https://rnfirebase.io/
  console.log(`Sending alert notification to ${user.userId} for alert ${alert.id}`);
}

const processUnacknowledgedAlerts = async () => {
  const date: Date = new Date();
  const alerts = await AlertData.findUnacknowledgedAlerts(date);

  for (const alert of alerts) {
    const teamUser = await TeamsService.getNextResponder(alert.teamId);

    if (teamUser) {
      await sendAlertNotification(teamUser, alert);
      await AlertData.acknowledgeAlert(alert.id);
    }
  }
  return alerts;
}

const escalateAlert = async (alertId: string) => {
  const date = new Date();

  const alert = await AlertData.findAlertById(alertId);

  if (!alert) {
    throw new Error('Alert not found');
  }

  if (alert.isEscalated) {
    throw new Error('Alert already escalated');
  }

  if (alert.responseDeadline && alert.responseDeadline > date) {
    throw new Error('Response deadline not reached');
  }

  const minutesToDeadline = parseInt(process.env.MINUTES_TO_DEADLINE || '') || 5;
  const responseDeadline = moment(date).add(minutesToDeadline, 'minutes').toDate();

  const updatedAlert = await AlertData.updateAlert(alertId, {
    isEscalated: true,
    responseDeadline,
  });

  return updatedAlert;
};

export default {
  processUnacknowledgedAlerts,
  escalateAlert,
};