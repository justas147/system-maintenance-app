import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import AlertDetails from '@/components/alerts/AlertDetails';
import BackHeader from '@/components/BackHeader';

const AlertPage = () => {
  return (
    <View style={styles.mainContainer}>
      <BackHeader title="Alert details"/>
      <View style={styles.container}>
        <AlertDetails/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, padding: 20 },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  alertId: {
    fontSize: 18,
  },
});

export default AlertPage;