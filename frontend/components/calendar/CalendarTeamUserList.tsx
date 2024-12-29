import { useBoundStore } from '@/state';
import { MarkedDateUser } from '@/services/schedules/types/ScheduleDto';
import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ErrorMessage from '../common/ErrorMessage';
import Spinner from '../common/Spinner';

export default function CalendarTeamUserList() {
  const markedDateUsers = useBoundStore(state => state.markedDateUsers);
  const isLoading = useBoundStore(state => state.isLoadingSchedules);
  const error = useBoundStore(state => state.scheduleError);

  const currentMakedDateUserList = useMemo(() => {
    if (!markedDateUsers) {
      return [];
    }

    return Object.values(markedDateUsers);
  }, [markedDateUsers]);

  const renderItem = useMemo(() => {
    return ({ item }: { item: MarkedDateUser }) => (
      <View style={styles.userContainer}>
        <View 
          style={[
            styles.colorIndicator, 
            { backgroundColor: item.color || '#808080' }
          ]} 
        />
        <Text style={styles.userName}>{item.name}</Text>
      </View>
    );
  }, []); // Empty dependency array since it doesn't depend on any props

  const keyExtractor = useMemo(() => {
    return (item: MarkedDateUser) => item.id;
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error}
      />
    );
  }

  return (
    <FlatList
      data={currentMakedDateUserList}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      removeClippedSubviews={true}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No users available</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    flexGrow: 1,           // Ensures proper scrolling
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,            // Added padding for better touch targets
    backgroundColor: '#fff', // Added background color
    borderRadius: 8,       // Added rounded corners
    shadowColor: '#000',   // Added subtle shadow
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,        // Added border
    borderColor: 'rgba(0,0,0,0.1)',
  },
  userName: {
    fontSize: 16,
    color: '#333',         // Added specific color
    fontWeight: '500',     // Added medium weight
  },
  emptyText: {
    textAlign: 'center',
    padding: 16,
    color: '#666',
  },
  errorMessage: {
    margin: 16,
  },
});