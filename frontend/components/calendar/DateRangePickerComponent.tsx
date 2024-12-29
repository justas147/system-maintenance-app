import { useState, useCallback, useEffect } from "react";
import { Pressable, View, StyleSheet, Text } from "react-native";
import { DatePickerModal } from 'react-native-paper-dates';
import { enGB, registerTranslation } from 'react-native-paper-dates'
import { useBoundStore } from "@/state";
import { handleError } from "@/utils/error";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import Spinner from "../common/Spinner";

registerTranslation('en-GB', enGB);

interface DateRange {
  startDate: CalendarDate | undefined;
  endDate: CalendarDate | undefined;
}

export default function DateRangePickerComponent() {
  const disabledDates = useBoundStore(state => state.disabledDates);
  const user = useBoundStore(state => state.user);
  const selectedTeam = useBoundStore(state => state.selectedTeam);
  const addSchedule = useBoundStore(state => state.addSchedule);
  const isLoading = useBoundStore(state => state.isLoadingSchedules);
  const setDisabledDates = useBoundStore(state => state.setDisabledDates);
  
  const [range, setRange] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined
  });
  const [open, setOpen] = useState(false);

  // Fetch disabled dates when component mounts or user/team changes
  useEffect(() => {
    const fetchDisabledDates = async () => {
      if (user?.id && selectedTeam?.id) {
        await setDisabledDates(user.id, selectedTeam.id);
      }
    };

    fetchDisabledDates();
    console.log("Disabled dates: ", disabledDates);
  }, [user?.id, selectedTeam?.id, setDisabledDates]);

  // React Hook that lets you cache a function definition between re-renders
  // Used to memoize functions (store in memory) so they are not recreated on 
  // every render. This is particularly useful in situations where passing 
  // functions as props causes unnecessary re-renders or where a function is 
  // used as a dependency in other hooks like 'useEffect'.
  const onDismiss = useCallback(() => {
    setOpen(false);
    setRange({ startDate: undefined, endDate: undefined });
  }, [setOpen]);

  const onConfirm = useCallback(
    async ({ startDate, endDate }: DateRange) => {
      if (!startDate || !endDate) {
        handleError("Please select both start and end dates");
        return;
      }

      if (!user?.id || !selectedTeam?.id) {
        handleError("User or team not found");
        return;
      }

      setOpen(false);
      setRange({ startDate, endDate });

      // startDate seems to be one day early
      // same issue for other, but they claim it's only in development environment:
      // https://github.com/web-ridge/react-native-paper-dates/issues/344
      console.log("Selected range: ", startDate, endDate);

      try {
        await addSchedule({
          userId: user.id,
          teamId: selectedTeam.id,
          isActive: true,
          startAt: new Date(startDate),
          endAt: new Date(endDate),
        });

        setRange({ startDate: undefined, endDate: undefined });
        setOpen(false);
      } catch (error) {
        handleError("Failed to add schedule: " + error);
      }
    },
    [setOpen, setRange]
  );

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <View>
      <Pressable style={styles.button} onPress={() => setOpen(true)}>
        <Text style={styles.text}>Select range</Text>
      </Pressable>
      
      <DatePickerModal
        locale="en"
        mode="range"
        visible={open}
        label='Select "on-call" range'
        onDismiss={onDismiss}
        startDate={range.startDate}
        endDate={range.endDate}
        onConfirm={onConfirm}
        validRange={
          {
            disabledDates: disabledDates || [],
            startDate: new Date(),
            endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
          }
        }
        animationType="slide"
        presentationStyle="pageSheet"
        closeIcon="close"
        saveLabel="Confirm"
        startLabel="Start"
        endLabel="End"
      />
    </View>
  )
}

const styles = StyleSheet.create({
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