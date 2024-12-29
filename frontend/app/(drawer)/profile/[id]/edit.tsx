import { useBoundStore } from '@/state';
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import BackHeader from '@/components/BackHeader';

const EditProfile = () => {
  const user = useBoundStore.getState().user;

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = async () => {
    if (!user) {
      return;
    }

    const updateUser = await useBoundStore.getState().editUser(user?.id, name, email);
    setName(updateUser?.name || '');
    setEmail(updateUser?.email || '');

    router.replace('/profile');
  };

  return (
    <View style={styles.container}>
      <BackHeader title="Edit profile"/>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default EditProfile;