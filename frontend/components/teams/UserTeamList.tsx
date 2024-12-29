import { useBoundStore } from '@/state';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { DataTable } from 'react-native-paper';
import { router } from 'expo-router';
import { List } from 'react-native-paper';

export function UserTeamList() {
  const [page, setPage] = useState<number>(0);
  const [numberOfItemsPerPageList] = useState([1, 2, 3]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );
  const teams = useBoundStore((state) => state.teamSelect);

  useEffect(() => {
    setPage(0);
  }, [teams]);

  return (
    <View>
      {teams.map((team, index) => (
        <List.Item
          key={index}
          title={team.name}
          onPress={() => router.push(`/teams/${team.id}`)}
          right={props => <List.Icon {...props} icon="pen" />}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
