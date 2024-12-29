import { create } from 'zustand';
import { AlertSlice, createAlertSlice } from './alerts';
import { TeamSlice, createTeamSlice } from './teams';
import { UserSlice, createUserSlice } from './user';
import { AuthSlice, createAuthSlice } from './auth';
import { ScheduleSlice, createScheduleSlice } from './schedules';
import { NotificationSlice, createNotificationSlice } from './notifications';
import { devtools } from 'zustand/middleware';

export const useBoundStore = create<
  AlertSlice & 
  TeamSlice & 
  UserSlice & 
  AuthSlice &
  NotificationSlice &
  ScheduleSlice
>()(
  devtools(
    (...a) => ({
      ...createAlertSlice(...a),
      ...createTeamSlice(...a),
      ...createUserSlice(...a),
      ...createAuthSlice(...a),
      ...createNotificationSlice(...a),
      ...createScheduleSlice(...a),
    })
  ),
);
