import MainCalendarViewComponent from "@/components/calendar/MainCalendarViewComponent";
import { View } from "react-native";
import { useBoundStore } from "@/state";
import { useEffect, useState } from "react";

export default function CalendarPage() {
  useEffect(() => {
    const fetchData = async () => {
      const teamId = useBoundStore.getState().selectedTeam?.id;
      const userId = useBoundStore.getState().user?.id;

      if (!teamId || !userId) {
        console.error("Team or user not found");
        return;
      }

      await useBoundStore.getState().setMarkedDates(userId, teamId);
    }

    fetchData();
  }, []);

  return (
    <View>
      <MainCalendarViewComponent/>
    </View>
  );
}