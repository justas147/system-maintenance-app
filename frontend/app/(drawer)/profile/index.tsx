import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useBoundStore } from '@/state';
import ProfileDetails from '@/components/profile/ProfileDetails';

const ProfileScreen = () => {
  const user = useBoundStore.getState().user;

  return (
    <View style={styles.container}>
      {user ? (
        <ProfileDetails user={user} />
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});

export default ProfileScreen;