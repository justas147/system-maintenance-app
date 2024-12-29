import { MarkedDatesResponse, SelecetdSchedule } from "./types/ScheduleDto";
import api from "../../utils/api";

const fetchSelectedSchedule = async (scheduleId: string): Promise<SelecetdSchedule> => {
  try {
    console.log("Fetching selected schedule: ", scheduleId);

    const response = await api.get(`schedules/${scheduleId}`);

    if (response.status !== 200) {
      throw new Error(`Failed to fetch selected schedule, response: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const fetchDisabledDates = async (userId: string, teamId: string): Promise<Date[]> => {
  try {
    console.log("Fetching disabled dates for team: ", teamId, " and user: ", userId);

    const response = await api.get(`schedules/teams/${teamId}/user/${userId}/disabled`);

    if (response.status !== 200) {
      throw new Error(`Failed to fetch disabled dates, response: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const fetchMarkedDates = async (userId: string, teamId: string): Promise<MarkedDatesResponse> => {
  try {
    console.log("Fetching marked dates for team: ", teamId, " and user: ", userId);

    const response = await api.get(`schedules/teams/${teamId}/user/${userId}`);

    if (response.status !== 200) {
      console.log(response.statusText);
      throw new Error(`Failed to fetch marked dates, response: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const addSchedule = async (schedule: any): Promise<MarkedDatesResponse> => {
  try {
    console.log("Adding schedule: ", schedule);

    const response = await api.post(`schedules`, schedule);

    if (response.status !== 201) {
      throw new Error(`Failed to add schedule, response: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const deleteSchedule = async (scheduleId: string): Promise<MarkedDatesResponse> => {
  try {
    console.log("Deleting schedule: ", scheduleId);

    const response = await api.delete(`schedules/${scheduleId}`);

    if (response.status !== 200) {
      throw new Error(`Failed to delete schedule, response: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default {
  fetchSelectedSchedule,
  fetchDisabledDates,
  fetchMarkedDates,
  addSchedule,
  deleteSchedule,
}