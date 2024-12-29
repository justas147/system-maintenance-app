import AlertData from "./AlertData";
import moment from "moment";
import TeamsService from "../../modules/teams/TeamsService";
import { Alert } from "./types/Alert";
import { Expo } from 'expo-server-sdk';

// Create a new Expo SDK client
// optionally providing an access token if you have enabled push security
const expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
  /*
   * @deprecated
   * The optional useFcmV1 parameter defaults to true, as FCMv1 is now the default for the Expo push service.
   *
   * If using FCMv1, the useFcmV1 parameter may be omitted.
   * Set this to false to have Expo send to the legacy endpoint.
   *
   * See https://firebase.google.com/support/faq#deprecated-api-shutdown
   * for important information on the legacy endpoint shutdown.
   *
   * Once the legacy service is fully shut down, the parameter will be removed in a future PR.
   */
  useFcmV1: true,
});


const sendAlertNotification = async (token: string, teamName: string, type: string, alert: Alert) => {
  console.log(`Sending alert notification for alert ${alert.id}`);

  // Check that all your push tokens appear to be valid Expo push tokens
  if (!Expo.isExpoPushToken(token)) {
    console.error(`Push token ${token} is not a valid Expo push token`);
    return;
  }

  // Create the messages that you want to send to clients
  let messages: any[] = [];
  // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
  // TODO: Set correct message body and add type

  if (type === 'push-notification') {
    messages.push({
      to: token,
      sound: 'default',
      title: alert.alertTitle,
      body: alert.alertMessage,
      data: { 
        alertTitle: alert.alertTitle,
        alertMessage: alert.alertMessage,
        teamName: teamName,
        alertType: type,
      },
    });
  } else if (type === 'alert') {
    messages.push({
      to: token,
      sound: 'default',
      data: { 
        alertTitle: alert.alertTitle,
        alertMessage: alert.alertMessage,
        teamName: teamName,
        alertType: type,
      },
    });
  }

  let chunks = expo.chunkPushNotifications(messages);
  let tickets: any[] = [];
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(...ticketChunk);
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    } catch (error) {
      console.error(error);
    }
  }

  let receiptIds: any[] = [];
  for (let ticket of tickets) {
    // NOTE: Not all tickets have IDs; for example, tickets for notifications
    // that could not be enqueued will have error information and no receipt ID.
    if (ticket.status === 'ok') {
      receiptIds.push(ticket.id);
    }
  }

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  for (let chunk of receiptIdChunks) {
    try {
      let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
      console.log(receipts);

      // The receipts specify whether Apple or Google successfully received the
      // notification and information about an error, if one occurred.
    } catch (error) {
      console.error(error);
    }
  }
}

const processUnacknowledgedAlerts = async () => {
  console.log('Processing unacknowledged alerts');

  const date: Date = new Date();

  try {
    const alerts = await AlertData.findUnacknowledgedAlerts(date);

    console.log(`Found ${alerts.length} unacknowledged alerts`);
    for (const alert of alerts) {
      // TODO: Implement better escalation logic, where more then one user can be notified
      await escalateAlert(alert.id);
  
      const teamUser = await TeamsService.getNextResponder(alert.teamId);
      
      console.log(
        `Selected next responder: ${teamUser?.userId}. Push notification token: ${teamUser?.pushNotificationToken}`
      ); 
      if (!teamUser) {
        continue;
      }

      if (!teamUser.teamName) {
        throw new Error('Team name not found');
      }
      console.log('Team name:', teamUser.teamName);
    
      console.log('Team notification type:', teamUser.teamNotificationType);
      let teamNotificationType = teamUser.teamNotificationType || 'push-notification';
      
      console.log('Sending alert notification to:', teamUser.userId);
      await sendAlertNotification(teamUser.pushNotificationToken, teamUser.teamName, teamNotificationType, alert);
      // await AlertData.acknowledgeAlert(alert.id);
    }
    return alerts;
  } catch (error) {
    console.error(error);
    return [];
  }
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

const alertCurrentOnCall = async (alert: Alert) => {
  const teamUserId = await TeamsService.getCurrentRecieverId(alert.teamId);

  // TODO: Implement better escalation logic, where more then one user can be notified
  if (!teamUserId) {
    throw new Error('No team member to notify found');
  }

  console.log('Alerting current on call:', teamUserId);
  const teamUser = await TeamsService.getById(teamUserId);

  console.log(teamUser);
  if (!teamUser) {
    throw new Error('Team member not found');
  }

  if (!teamUser.pushNotificationToken) {
    throw new Error('Push notification token not found');
  }

  if (!teamUser.teamName) {
    throw new Error('Team name not found');
  }
  console.log('Team name:', teamUser.teamName);

  console.log('Team notification type:', teamUser.teamNotificationType);
  let teamNotificationType = teamUser.teamNotificationType || 'push-notification';
  
  console.log('Sending alert notification to:', teamUser.userId);
  await sendAlertNotification(teamUser.pushNotificationToken, teamUser.teamName, teamNotificationType, alert);
}

export default {
  processUnacknowledgedAlerts,
  escalateAlert,
  alertCurrentOnCall,
};