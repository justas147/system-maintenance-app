import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useBoundStore } from '@/state';

const TeamSelect = () => {
  const teamSelect = useBoundStore((state) => state.teamSelect);
  const selectedTeam = useBoundStore((state) => state.selectedTeam);
  const setSelectTeam = useBoundStore((state) => state.setSelectTeam);

  const handleSelect = (team: any) => {
    if (selectedTeam?.id === team.id) {
      return;
    }

    setSelectTeam(team);
  };

  return (
    <View>
      <Text style={styles.header}>Select Team</Text>
      <Picker
        selectedValue={selectedTeam?.name}
        onValueChange={(itemValue) => handleSelect(itemValue)}
      >
        {teamSelect.map((team) => (
          <Picker.Item key={team.id} label={team.name} value={team} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 10,
    paddingHorizontal: 16,
    fontSize: 12,
  },
});

export default TeamSelect;