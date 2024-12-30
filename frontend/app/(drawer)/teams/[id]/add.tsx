import BackHeader from '@/components/BackHeader';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useBoundStore } from '@/state';
import { handleError } from '@/utils/error';
import { validateEmail } from '@/utils/validation';

const AddTeamMember = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const inviteMember = useBoundStore(state => state.inviteMember);
  const team = useBoundStore(state => state.selectedTeam);
  const teamError = useBoundStore(state => state.teamError);
  const isLoadingTeams = useBoundStore(state => state.isLoadingTeams);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (validateEmail(text)) {
      setEmailError('');
    } else {
      setEmailError('Please enter a valid email address.');
    }
  };

  const handleAddMember = async () => {
    if (!validateEmail(email) || !email) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    if (!team) {
      handleError('No team selected');
      return;
    }

    await inviteMember(team.id, email);

    if (teamError) {
      handleError(teamError);
      return;
    }

    Alert.alert('Success', `Team member with email ${email} added!`);
    setEmail('');
  };

  return (
    <View style={styles.container}>
      <BackHeader title="Add New Team Member" path="teams"/>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
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
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default AddTeamMember;