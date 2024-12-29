import { View } from "react-native";
import CalendarComponent from './CalendarComponent';
import DateRangePickerComponent from './DateRangePickerComponent';
import { useBoundStore } from "@/state";
import { useEffect } from "react";

export default function MainCalendarViewComponent(props: any) {
  useEffect(() => {
    const fetchData = async () => {
      const teamId = useBoundStore.getState().selectedTeam?.id;
      const userId = useBoundStore.getState().user?.id;

      if (!teamId || !userId) {
        console.error("Team or user not found");
        return;
      }

      await useBoundStore.getState().setDisabledDates(userId, teamId);
    }

    fetchData();
  }, []);

  return (
    <View>
      <DateRangePickerComponent/>
      <CalendarComponent/>
    </View>
  );
}