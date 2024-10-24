import { knex } from '../../data/providers/KnexProvider';
import { NewSchedule, Schedule, ScheduleUpdate } from './types/Schedule';

const getScheduleTable = () => {
  return knex.table('schedules');
}

const findAll = async (): Promise<Schedule[]> => {
  const schedules = await getScheduleTable().select('*');
  return schedules;
}

const findScheduleById = async (scheduleId: string): Promise<Schedule | null> => {
  const schedule = await getScheduleTable().where({ id: scheduleId }).first();
  return schedule || null;
}

const findScheduleByTeamId = async (teamId: string): Promise<Schedule[]> => {
  const schedules = await getScheduleTable().where({ teamId });
  return schedules;
}

const findScheduleByUserId = async (userId: string): Promise<Schedule[]> => {
  const schedules = await getScheduleTable().where({ userId });
  return schedules;
}

const findScheduleByTeamIdAndUserId = async (teamId: string, userId: string): Promise<Schedule[]> => {
  const schedules = await getScheduleTable().where({ teamId, userId });
  return schedules;
}

const createSchedule = async (schedule: NewSchedule): Promise<Schedule> => {
  const [createdSchedule] = await getScheduleTable().insert(schedule).returning('*');
  return createdSchedule;
}

const updateSchedule = async (scheduleId: string, updates: ScheduleUpdate): Promise<Schedule> => {
  const [updatedSchedule] = await getScheduleTable().where({ id: scheduleId }).update(updates).returning('*');
  return updatedSchedule;
}

const deleteSchedule = async (scheduleId: string): Promise<void> => {
  await getScheduleTable().where({ id: scheduleId }).delete();
}

export default {
  findAll,
  findScheduleById,
  findScheduleByTeamId,
  findScheduleByUserId,
  findScheduleByTeamIdAndUserId,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};