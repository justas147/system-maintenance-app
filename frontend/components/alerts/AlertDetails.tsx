import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { useBoundStore } from '@/state';
import Spinner from '../common/Spinner';

const AlertsDetails = () => {
  const selectedAlert = useBoundStore((state) => state.selectedAlert);
  const isLoading = useBoundStore((state) => state.isLoadingAlerts);
  const setAlertAsHandled = useBoundStore((state) => state.setAlertAsHandled);

  // convert date to readable format
  const formatDate = (date: Date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString();
  };

  const markAsHandled = async () => {
    if (!selectedAlert) {
      return;
    }

    console.log(`Marking alert ${selectedAlert.id} as handled`);
    await setAlertAsHandled(selectedAlert.id);
  };

  if (!selectedAlert) {
    return (
      <View>
        <Text variant="titleMedium">No alert selected</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <Spinner />
    );
  }

  return (
    <View>
      <Text variant="titleMedium">Id:</Text>
      <Text style={styles.value} variant='bodyMedium'>{selectedAlert.id}</Text>
      <Text variant="titleMedium">Message:</Text>
      <Text style={styles.value} variant='bodyMedium'>{selectedAlert.alertMessage}</Text>
      <Text variant="titleMedium">Source:</Text>
      <Text style={styles.value} variant='bodyMedium'>{selectedAlert.alertSource}</Text>
      <Text variant="titleMedium">Time:</Text>
      <Text style={styles.value} variant='bodyMedium'>{formatDate(selectedAlert.alertTime)}</Text>
      <Text variant="titleMedium">Handled:</Text>
      <Text style={styles.value} variant='bodyMedium'>{selectedAlert.isHandled ? 'Yes' : 'No'}</Text>
      <Text variant="titleMedium">Escalated:</Text>
      <Text style={styles.value} variant='bodyMedium'>{selectedAlert.isEscalated ? 'Yes' : 'No'}</Text>
      {selectedAlert.createdAt && (
        <>
          <Text variant="titleMedium">Created At:</Text>
          <Text style={styles.value}>{new Date(selectedAlert.createdAt).toLocaleString()}</Text>
        </>
      )}
      {selectedAlert.updatedAt && (
        <>
          <Text variant="titleMedium">Updated At:</Text>
          <Text style={styles.value}>{new Date(selectedAlert.updatedAt ).toLocaleString()}</Text>
        </>
      )}
      
      <Pressable style={styles.button} onPress={markAsHandled}>
        <Text style={styles.text}>Mark as handled</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    marginBottom: 10,
  },
  button: {
    marginTop: 16,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

export default AlertsDetails;