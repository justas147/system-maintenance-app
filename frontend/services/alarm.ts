import BackgroundTimer from 'react-native-background-timer';
import Sound from 'react-native-sound';

let alarmSound: Sound;

// Start Alarm (Runs even if the app is killed)
export const startAlarm = () => {
  alarmSound = new Sound('alarm.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('Failed to load sound', error);
      return;
    }
    alarmSound.setNumberOfLoops(-1);  // Infinite loop
    alarmSound.play();  // Start playing
  });

  // loaded successfully
  console.log('duration in seconds: ' + alarmSound.getDuration() + 'number of channels: ' + alarmSound.getNumberOfChannels());

  BackgroundTimer.runBackgroundTimer(() => {
    console.log('Alarm running in background');
  }, 5000);  // Keep service alive
};

// Stop Alarm
export const stopAlarm = () => {
  if (alarmSound) {
    alarmSound.stop(() => {
      alarmSound.release();
      BackgroundTimer.stopBackgroundTimer();
    });
  }
};