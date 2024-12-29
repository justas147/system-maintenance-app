import { StateCreator } from "zustand";
import SchedulesService from "../services/schedules/schedules";
import { Schedule } from "@/services/schedules/types/Schedule";
import { 
  MarkedDateUsers, 
  MarkedDates, 
  MarkedDatesResponse, 
  NewSchedule, 
  SelecetdSchedule
} from "@/services/schedules/types/ScheduleDto";

export interface ScheduleSlice {
  schedules: Schedule[];
  selectedSchedule: SelecetdSchedule | null;
  disabledDates: Date[];
  markedDates: MarkedDates;
  markedDateUsers: MarkedDateUsers;
  scheduleError: string;
  isLoadingSchedules: boolean;
  fetchSelectedSchedule: (scheduleId: string) => Promise<Schedule | undefined>;
  setDisabledDates: (userId: string, teamId: string) => Promise<Date[] | undefined>;
  setMarkedDates: (userId: string, teamId: string) => Promise<MarkedDatesResponse | undefined>;
  addSchedule: (schedule: NewSchedule) => Promise<MarkedDatesResponse | undefined>;
  deleteSchedule: (scheduleId: string) => Promise<MarkedDatesResponse | undefined>;
  removeSelectedSchedule: () => void;
  removeDisabledDates: () => void;
  removeMarkedDates: () => void;
}

export const createScheduleSlice: StateCreator<
  ScheduleSlice,
  [],
  [],
  ScheduleSlice
> = (set) => ({
  schedules: [],
  selectedSchedule: null,
  disabledDates: [],
  markedDates: {},
  markedDateUsers: {},
  scheduleError: "",
  isLoadingSchedules: false,
  fetchSelectedSchedule: async (scheduleId: string) => {
    set({ isLoadingSchedules: true });
    try {
      const selectedSchedule = await SchedulesService.fetchSelectedSchedule(scheduleId);
      set({ 
        selectedSchedule,
        isLoadingSchedules: false
      });
      return selectedSchedule;
    } catch (error) {
      set({ 
        isLoadingSchedules: false,
        scheduleError: "Failed to fetch selected schedule"
      });
      console.error("Failed to fetch selected schedule: ", error);
    }
  },
  setDisabledDates: async (userId: string, teamId: string) => {
    set({ isLoadingSchedules: true });
    try {
      const disabledDates = await SchedulesService.fetchDisabledDates(userId, teamId);
      const mappedDates: Date[] = disabledDates.map((date: Date) => {
        return new Date(date);
      });

      set({ 
        disabledDates: mappedDates,
        isLoadingSchedules: false
      });
      return mappedDates;
    } catch (error) {
      set({ 
        isLoadingSchedules: false,
        scheduleError: "Failed to fetch marked dates"
      });
      console.error("Failed to fetch disabled dates: ", error);
    }
  },
  setMarkedDates: async (userId: string, teamId: string) => {
    set({ isLoadingSchedules: true });
    try {
      const markedDatesRespose: MarkedDatesResponse = await SchedulesService.fetchMarkedDates(userId, teamId);
      set({ 
        markedDates: markedDatesRespose.markedDates,
        markedDateUsers: markedDatesRespose.markedDateUsers,
        isLoadingSchedules: false
      });
      return markedDatesRespose;
    } catch (error) {
      set({ 
        isLoadingSchedules: false,
        scheduleError: "Failed to fetch marked dates"
      });
      console.error("Failed to fetch marked dates: ", error);
    }
  },
  addSchedule: async (schedule: NewSchedule) => {
    set({ isLoadingSchedules: true });
    try {
      const markedDatesRespose = await SchedulesService.addSchedule(schedule);
      set({ 
        markedDates: markedDatesRespose.markedDates,
        markedDateUsers: markedDatesRespose.markedDateUsers,
        isLoadingSchedules: false
      });
      return markedDatesRespose;
    } catch (error) {
      set({ 
        isLoadingSchedules: false,
        scheduleError: "Failed to add schedule"
      });
      console.error("Failed to add schedule: ", error);
    }
  },
  deleteSchedule: async (scheduleId: string) => {
    set({ isLoadingSchedules: true });
    try {
      const markedDatesRespose = await SchedulesService.deleteSchedule(scheduleId);
      set({ 
        markedDates: markedDatesRespose.markedDates,
        markedDateUsers: markedDatesRespose.markedDateUsers,
        isLoadingSchedules: false
      });
      return markedDatesRespose;
    } catch (error) {
      set({
        isLoadingSchedules: false,
        scheduleError: "Failed to delete schedule"
      });
      console.error("Failed to delete schedule: ", error);
    }
  },
  removeSelectedSchedule: () => {
    set({ selectedSchedule: null });
  },
  removeDisabledDates: () => {
    set({ disabledDates: [] });
  },
  removeMarkedDates: () => {
    set({ 
      markedDates: {},
      markedDateUsers: {}
    });
  }
});
