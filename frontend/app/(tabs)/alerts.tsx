import * as React from 'react';
import { DataTable } from 'react-native-paper';

const MyComponent = () => {
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const [items] = React.useState([
   {
     name: 'Cronjob error',
   },
   {
     name: 'Pod down',
   },
   {
     name: 'High CPU usage',
   },
   {
     name: 'High memory usage',
   },
  ]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>Alerts</DataTable.Title>
      </DataTable.Header>

      {items.slice(from, to).map((item, index) => (
        <DataTable.Row key={index + 1}>
          <DataTable.Cell>{item.name}</DataTable.Cell>
          <DataTable.Cell>Go</DataTable.Cell>
        </DataTable.Row>
      ))}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(items.length / itemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${from + 1}-${to} of ${items.length}`}
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        showFastPaginationControls
        selectPageDropdownLabel={'Rows per page'}
      />
    </DataTable>
  );
};

export default MyComponent;