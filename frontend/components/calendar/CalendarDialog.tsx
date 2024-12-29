import { useBoundStore } from '@/state';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import Spinner from '../common/Spinner';
import { useState } from 'react';
import { Alert } from 'react-native';
import { handleError } from '@/utils/error';

interface ScheduleDialogProps {
  isVisible: boolean;
  scheduleData: any;
  onClose: () => void;
  onDelete: (scheduleId: string) => void;
}

export default function CalendarSelectDialog(
  { isVisible, onClose, onDelete }: ScheduleDialogProps
) {
  const selectedSchedule = useBoundStore((state) => state.selectedSchedule);
  const isLoading = useBoundStore((state) => state.isLoadingSchedules);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = () => {
    if (!selectedSchedule) {
      handleError("No schedule found for this date.");
      return;
    }

    if (!selectedSchedule.id) {
      handleError("Schedule ID not found");
      return;
    }

    const formatedDate = new Date(selectedSchedule.startAt).toLocaleString();
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete the schedule for ${formatedDate}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            setIsDeleting(true);
            try {
              onDelete(selectedSchedule.id);
            } catch (error) {
              console.error('Failed to delete schedule:', error);
            } finally {
              setIsDeleting(false);
            }
          },
          style: "destructive",
        },
      ]  
    );
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString();
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={onClose}>
        <Dialog.Title>
          Schedule Details
        </Dialog.Title>

        <Dialog.Content>
          <Text variant="titleMedium">Team member:</Text>
          <Text variant='bodyMedium'>{selectedSchedule?.userName}</Text>

          <Text variant="titleMedium">Team member email:</Text>
          <Text variant='bodyMedium'>{selectedSchedule?.userEmail}</Text>

          <Text variant="titleMedium">Team member role:</Text>
          <Text variant='bodyMedium'>{selectedSchedule?.teamRole}</Text>

          <Text variant="titleMedium">Starts at:</Text>
          <Text variant='bodyMedium'>{formatDate(selectedSchedule?.startAt)}</Text>

          <Text variant="titleMedium">Ends at:</Text>
          <Text variant='bodyMedium'>{formatDate(selectedSchedule?.endAt)}</Text>
        </Dialog.Content>

        <Dialog.Actions>
          <Button onPress={handleDelete} disabled={isDeleting}>Delete</Button>
          <Button onPress={onClose}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}  