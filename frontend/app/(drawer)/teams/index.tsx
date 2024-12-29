import React from 'react';
import { Pressable, View, StyleSheet, Text } from "react-native";
import { useBoundStore } from '@/state';
import { router } from 'expo-router';
import BackHeader from '@/components/BackHeader';
import { UserTeamList } from '@/components/teams/UserTeamList';

const TeamsScreen = () => {
  const userTeams = useBoundStore.getState().teamSelect;

  return (
    <View style={styles.container}>
      <BackHeader title="Your Teams"/>
      <Pressable 
        style={styles.button} 
        onPress={() => router.push('teams/create')} 
      >
        <Text style={styles.text}>Create team</Text>
      </Pressable>
      <UserTeamList/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  teamItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  teamName: { fontSize: 18 },
  button: {
    marginTop: 16,
    marginHorizontal: 8,
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

export default TeamsScreen;