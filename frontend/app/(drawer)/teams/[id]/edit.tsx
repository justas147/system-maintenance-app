import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useBoundStore } from '@/state';
import { Team, TeamEditDto } from '@/state/teams';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import BackHeader from '@/components/BackHeader';
import { handleError } from '@/utils/error';
import CustomButton from '@/components/common/CustomButton';
import Spinner from '@/components/common/Spinner';

const notificationTypes = [
  { label: 'Push Notification', value: 'push-notification' },
  { label: 'Alarm', value: 'alarm' },
];

const TeamEdit = () => {
  const route = useRoute();
  const { id } = route.params;
  
  const [team, setTeam] = useState<Team | undefined>(undefined);
  const [teamName, setTeamName] = useState('');
  const [notificationType, setNotificationType] = useState(notificationTypes[0]);

  const fetchStateTeam = useBoundStore((state) => state.fetchTeam);
  const updateTeam = useBoundStore((state) => state.updateTeam);
  const teamError = useBoundStore((state) => state.teamError);
  const isLoadingTeams = useBoundStore((state) => state.isLoadingTeams);

  useEffect(() => {
    const fetchTeam = async () => {
      const fetchedTeam = await fetchStateTeam(id);

      if (fetchedTeam) {
        setTeam(fetchedTeam);
        setTeamName(fetchedTeam.name);

        const currentType = notificationTypes.find(type => type.value === fetchedTeam.notificationType);

        if (!currentType) {
          handleError('Notification type not found');
          return;
        }

        setNotificationType(currentType);
      } else {
        handleError('Team not found');
      }
    };
    fetchTeam();
  }, [id]);

  const handleTypeSelect = (type: any) => {
    setNotificationType(type);
  };

  const handleSave = async () => {
    if (!team) return;

    const updatedTeam: TeamEditDto = { 
      name: teamName, 
      notificationType: notificationType.value
    };

    try {
      console.log('Updated team: ', updatedTeam);
      await updateTeam(id, updatedTeam);

      if (teamError) {
        handleError(teamError);
        return;
      }

      Alert.alert('Success', 'Team updated successfully');
      router.replace(`/teams/${team.id}`);
    } catch (error) {
      handleError('Failed to update team');
    }
  };

  if (isLoadingTeams) {
    return <Spinner />
  }

  return (
    <View style={styles.container}>
      <BackHeader title="Edit Team" />
      
      <TextInput
        style={styles.input}
        value={teamName}
        onChangeText={setTeamName}
        placeholder="Team Name"
      />

      <Picker
        selectedValue={notificationType}
        onValueChange={(itemValue) => handleTypeSelect(itemValue)}
      >
        {notificationTypes.map((type) => (
          <Picker.Item key={type.value} label={type.label} value={type} />
        ))}
      </Picker>

      <CustomButton title="Save Changes" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  dropdown: {
    marginBottom: 24,
    zIndex: 500,
  },
});

export default TeamEdit;