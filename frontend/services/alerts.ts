import api from "../utils/api";

const getTeamAlerts = async (teamId: string) => {
  try {
    const response = await api.get(`alerts/team/${teamId}`);

    if (response.status !== 200) {
      throw new Error(`Failed to get team alerts, response: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const getTeamUserAlerts = async (teamId: string, userId: string) => {
  try {
    const response = await api.get(`alerts/team/${teamId}/user/${userId}`);

    if (response.status !== 200) {
      throw new Error(`Failed to get team user alerts, response: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const setAlertAsHandled = async (alertId: string) => {
  try {
    const response = await api.get(`alerts/${alertId}/acknowledge`);

    if (response.status !== 200) {
      throw new Error(`Failed to set alert as handled, response: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const updateAlert = async (id: string, alert: any) => {
  try {
    const response = await api.put(`alerts/${id}`, alert);

    if (response.status !== 200) {
      throw new Error(`Failed to update alert, response: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default {
  getTeamAlerts,
  getTeamUserAlerts,
  updateAlert,
  setAlertAsHandled,
}