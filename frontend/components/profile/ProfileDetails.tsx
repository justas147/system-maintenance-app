import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import BackHeader from '@/components/BackHeader';

const ProfileDetails = (props: any) => {
  return (
    <View>
      <BackHeader title="Profile"/>
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>{props.user.name}</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{props.user.email}</Text>
      {props.user.createdAt && (
        <>
          <Text style={styles.label}>Created At:</Text>
          <Text style={styles.value}>{new Date(props.user.createdAt).toLocaleString()}</Text>
        </>
      )}
      {props.user.updatedAt && (
        <>
          <Text style={styles.label}>Updated At:</Text>
          <Text style={styles.value}>{new Date(props.user.updatedAt ).toLocaleString()}</Text>
        </>
      )}
      
      <Pressable style={styles.button} onPress={() => router.push(`profile/${props.user.id}/edit`)}>
        <Text style={styles.text}>Edit</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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

export default ProfileDetails;