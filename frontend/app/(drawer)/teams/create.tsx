import BackHeader from '@/components/BackHeader';
import { useBoundStore } from '@/state';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Menu, Text } from 'react-native-paper';

const CreateTeam = () => {
  const [teamName, setTeamName] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const createTeam = useBoundStore((state) => state.createTeam);
  const user = useBoundStore((state) => state.user);

  const notificationTypes = [
    { label: 'Push notification', value: 'push-notification' },
    { label: 'Alarm', value: 'alarm' },
  ];

  const handleSelect = (type: any) => {
    setNotificationType(type);
    setMenuVisible(false);
  };

  const handleCreateTeam = async () => {
    if (teamName.trim() === '') {
      Alert.alert('Error', 'Team name cannot be empty');
      return;
    }

    // Add logic to handle team creation
    Alert.alert('Success', `Team "${teamName}" created!`);
    setTeamName('');
    await createTeam({ name: teamName, notificationType}, user.id);
    router.replace('/teams');
  };

  return (
    <View style={styles.container}>
      <BackHeader title="Create a team"/>
      <Text style={styles.label}>Enter Team Name:</Text>
      <TextInput
        style={styles.input}
        value={teamName}
        onChangeText={setTeamName}
        placeholder="Team Name"
      />

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button mode="outlined" onPress={() => setMenuVisible(true)}>
            {notificationType ? notificationType : 'Select Notification Type'}
          </Button>
        }
      >
        {notificationTypes.map((item) => (
          <Menu.Item
            key={item.value}
            onPress={() => handleSelect(item.label)}
            title={item.label}
          />
        ))}
      </Menu>

      <Button
        mode="contained"
        onPress={handleCreateTeam}
        disabled={!teamName || !notificationType}
        style={styles.button}
      >
        Create Team
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  button: {
    marginTop: 20,
  },
});

export default CreateTeam;