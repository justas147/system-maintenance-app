import cron from 'node-cron';
import AlertsService from '../modules/alerts/AlertsService';

// Schedule the task to run every minute
cron.schedule('* * * * *', async () => {
  await AlertsService.processUnacknowledgedAlerts();
  console.log('Alerts processed');
});

console.log('Alert checker started.'); 