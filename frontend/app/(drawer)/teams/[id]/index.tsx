import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { Divider, List, Text } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { useBoundStore } from '@/state';
import { Team } from '@/state/teams';
import { router } from 'expo-router';
import BackHeader from '@/components/BackHeader';
import { handleError } from '@/utils/error';
import CustomButton from '@/components/common/CustomButton';

const TeamDetails = () => {
  const route = useRoute();
  const { id } = route.params;
  const [ team, setTeam ] = useState<Team | undefined>(undefined);
  const [ role, setRole ] = useState<string | undefined>(undefined);
  const fetchStateTeam = useBoundStore((state) => state.fetchTeam);
  const removeStateTeam = useBoundStore((state) => state.removeTeam);
  const teamSelect = useBoundStore((state) => state.teamSelect);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!id) {
        handleError("Team ID not found");
        return;
      }

      const team = await fetchStateTeam(id);
      setTeam(team);

      const role = teamSelect.find((team) => team.id === id)?.role;
      if (!role) {
        throw new Error("Role not found");
      }

      setRole(role);
    };

    fetchTeam();
  }, [id]);

  const handleTeamDelete = async () => {
    if (!team) {
      handleError("Team not found");
      return;
    }

    Alert.alert("Current disabled", "Team deletion is currently disabled");
    // await removeStateTeam(team.id);
    // router.replace('/teams');
  };

  // TODO: fix redirect to add and edit pages
  // TODO: add team user list to edit user roles
  return (
    <View style={styles.container}>
      <BackHeader 
        title={team?.name ?? "Team details"}
      />

      <View style={{ marginBottom: 8 }}>
        <Text variant="titleMedium">Notification type:</Text>
        <Text variant='bodyMedium'>{team?.notificationType}</Text>
      </View>
      <Divider /> 

      <View style={{ marginTop: 8 }}>
        <Text variant="titleMedium">Members:</Text>
        <Text variant='bodyMedium'>{team?.members.length}</Text>
      </View>

      { role === 'admin' && 
        <CustomButton 
          title="Add New User" 
          onPress={() => router.push(`teams/${team?.id}/add`)}
        />
      }
      { role === 'admin' && 
        <CustomButton 
          title="Edit Team Data" 
          onPress={() => router.push(`teams/${team?.id}/edit`)} 
        />
      }
      { role === 'admin' && 
        <CustomButton title="Delete Team" onPress={handleTeamDelete} />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
  },
});

export default TeamDetails;