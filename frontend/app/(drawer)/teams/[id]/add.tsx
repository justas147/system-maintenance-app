import BackHeader from '@/components/BackHeader';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const AddTeamMember = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleAddMember = () => {
    if (email && name) {
      // TODO: Add your logic to add the team member via email
      Alert.alert('Success', `Team member with email ${email} added!`);
      setEmail('');
    } else {
      Alert.alert('Error', 'Please enter a valid email address.');
    }
  };

  return (
    <View style={styles.container}>
      <BackHeader title="Add New Team Member" path="teams"/>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={name}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Add Member" onPress={handleAddMember} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default AddTeamMember;