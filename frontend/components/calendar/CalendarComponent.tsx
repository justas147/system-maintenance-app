import { Calendar } from 'react-native-calendars';
import { View } from "react-native";
import CalendarTeamUserList from './CalendarTeamUserList';
import { handleError } from '@/utils/error';
import { useBoundStore } from '@/state';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import { useState } from 'react';
import CalendarDialog from './CalendarDialog';

export default function CalendarView() {  
  const currentMarkedDates = useBoundStore(state => state.markedDates);
  const isLoading = useBoundStore(state => state.isLoadingSchedules);
  const error = useBoundStore(state => state.scheduleError);
  const deleteSchedule = useBoundStore(state => state.deleteSchedule);
  const fetchSelectedSchedule = useBoundStore(state => state.fetchSelectedSchedule);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDateData, setSelectedDateData] = useState<any>(null);

  const handleOnPress = async (date: any) => {
    const selectedDate = currentMarkedDates[date.dateString];

    if (selectedDate) {
      console.log("Selected date data: ", selectedDate);
      setSelectedDateData(selectedDate);
      setModalVisible(true);
      await fetchSelectedSchedule(selectedDate.id);
    } else {
      handleError("No schedule found for this date.");
    }
  };

  const handleDelete = async () => {
    if (!selectedDateData?.id) {
      handleError("Schedule ID not found");
      return;
    }

    try {
      await deleteSchedule(selectedDateData.id);
      setModalVisible(false);
    } catch (error) {
      handleError("Failed to delete schedule: " + error);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <View>
      <Calendar
        markingType={'period'}
        markedDates={currentMarkedDates}
        onDayPress={handleOnPress}
      />
      <CalendarTeamUserList/>

      <CalendarDialog
        isVisible={isModalVisible}
        scheduleData={selectedDateData}
        onDelete={handleDelete}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}