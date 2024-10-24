// Cronjob script to check unacknowledged alerts and 
// send notification to next user

import AlertService from '../../modules/alerts/AlertsService';

( async () => {
  await AlertService.processUnacknowledgedAlerts();
  process.exit(0);
})();