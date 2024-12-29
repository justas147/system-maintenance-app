import { useBoundStore } from '@/state';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { DataTable } from 'react-native-paper';
import { router } from 'expo-router';

export function AlertList() {
  // TODO: Get paginated alerts from backend
  const alerts = useBoundStore((state) => state.alerts);
  const setSelectedAlert = useBoundStore((state) => state.setSelectedAlert);

  const [page, setPage] = useState<number>(0);
  const [numberOfItemsPerPageList] = useState([11]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, alerts.length);

  const formatDate = (date: Date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString(
      'en-GB',
    ); 
  }

  const handlePress = (id: string) => {
    console.log(id);

    router.push(`/alerts/${id}`);
    setSelectedAlert(id);
  }

  useEffect(() => {
    setPage(0);
  }, [alerts]);

  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title style={{ flex: 4 }}>Alert</DataTable.Title>
        <DataTable.Title style={{ flex: 3 }}>Date</DataTable.Title>
        <DataTable.Title style={{ flex: 2 }}>Handled</DataTable.Title>
      </DataTable.Header>

      {alerts.slice(from, to).map((alerts, index) => (
        <DataTable.Row key={index + 1} onPress={() => handlePress(alerts.id)}>
          <DataTable.Cell style={{ flex: 4 }}>{alerts.alertMessage}</DataTable.Cell>
          <DataTable.Cell style={{ flex: 3 }}>{formatDate(alerts.alertTime)}</DataTable.Cell>
          <DataTable.Cell style={{ flex: 2 }}>{alerts.isHandled ? 'Yes' : 'No'}</DataTable.Cell>
        </DataTable.Row>
      ))}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(alerts.length / itemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${from + 1}-${to} of ${alerts.length}`}
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        showFastPaginationControls
        selectPageDropdownLabel={'Rows per page'}
      />
    </DataTable>
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
