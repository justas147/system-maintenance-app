import { StateCreator } from 'zustand';
import alertService from "../services/alerts";

export interface Alert {
  id: string;
  teamId: string;
  handledBy: string;
  alertMessage: string;
  alertSource: string;
  alertTime: Date;
  alertType: string;
  isHandled: boolean;
  isEscalated: boolean;
  responseDeadline?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export interface AlertSlice {
  alerts: Alert[];
  selectedAlert: Alert | undefined;
  isLoadingAlerts: boolean;
  alertsError: string;
  fetchAlerts: (teamId: string, userId: string) => Promise<void>;
  setSelectedAlert: (alertId: string) => void;
  setAlertAsHandled: (alertId: string) => Promise<void>;
  getAlert: (id: string) => Alert | undefined;
  addAlert: (alert: Alert) => void;
  removeAlert: (id: string) => void;
  updateAlert: (id: string, alert: Alert) => void;
  clearAlerts: () => void;
};

export const createAlertSlice: StateCreator<
  AlertSlice,
  [],
  [],
  AlertSlice
> = (set, get) => ({
  alerts: [],
  selectedAlert: undefined,
  isLoadingAlerts: false,
  alertsError: "",
  fetchAlerts: async (teamId: string, userId: string) => {
    set({ isLoadingAlerts: true });
    try {
      const userTeamAlerts: Alert[] = await alertService.getTeamAlerts(teamId);
      console.log("User team alerts: ", userTeamAlerts);
      set({ 
        alerts: userTeamAlerts,
        isLoadingAlerts: false,
      });
    } catch (error) {
      set({ 
        alertsError: "Failed to fetch alerts",
        isLoadingAlerts: false,
      });
    }
  },
  setSelectedAlert: (alertId: string) => {
    const alert = get().alerts.find((alert) => alert.id === alertId);
    set({ selectedAlert: alert });
  },
  setAlertAsHandled: async (alertId: string) => {
    set({ isLoadingAlerts: true });
    try {
      const updatedAlert = await alertService.setAlertAsHandled(alertId);
      const currentSelectedAlert = get().selectedAlert;
      set({ 
        alerts: get().alerts.map((alert) => alert.id === alertId ? updatedAlert : alert),
        selectedAlert: currentSelectedAlert ? updatedAlert : undefined,
        isLoadingAlerts: false,
      });
    } catch (error) {
      set({
        alertsError: "Failed to set alert as handled",
        isLoadingAlerts: false,
      });
    }
  },
  getAlert: (id: string) => {
    return get().alerts.find((alert) => alert.id === id);
  },
  addAlert: (alert: Alert) => set((state) => ({ alerts: [...state.alerts, alert] })),
  removeAlert: (id: string) => set((state) => ({ alerts: state.alerts.filter((alert) => alert.id !== id) })),
  updateAlert: (id: string, alert: Alert) => set((state) => ({ alerts: state.alerts.map((a) => a.id === id ? alert : a) })),
  clearAlerts: () => set({ alerts: [] }),
});
