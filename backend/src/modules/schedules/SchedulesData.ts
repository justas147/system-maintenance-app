import { knex } from '../../data/providers/KnexProvider';
import { NewSchedule, Schedule, ScheduleUpdate } from './types/Schedule';
import { v4 as uuid } from 'uuid';

const getScheduleTable = () => {
  return knex.table('oncall_schedules');
}

const findAll = async (): Promise<Schedule[]> => {
  const schedules = await getScheduleTable().select('*');
  return schedules;
}

const findScheduleById = async (scheduleId: string): Promise<Schedule | null> => {
  const schedule = await getScheduleTable().where({ id: scheduleId }).first();
  return schedule || null;
}

const findDetailedScheduleById = async (scheduleId: string): Promise<Schedule | null> => {
  const schedule = await getScheduleTable()
    .select(
      'oncall_schedules.*',
      'users.name as userName',
      'users.email as userEmail',
      'team_members.role as teamRole',
      'team_members.color as teamColor',
      'teams.name as teamName'
    )
    .join('users', 'oncall_schedules.userId', 'users.id')
    .join('team_members', 'oncall_schedules.teamId', 'team_members.teamId')
    .join('teams', 'team_members.teamId', 'teams.id')
    .where('oncall_schedules.id', scheduleId)
    .first();

  return schedule || null;
};

const findScheduleByTeamId = async (teamId: string): Promise<Schedule[]> => {
  console.log('Finding schedules by team id', teamId);
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
  // TODO: fix this
  const id = uuid();
  await getScheduleTable().insert({
    id,
    ...schedule,
  });

  const createdSchedule = await findScheduleById(id);

  if (!createdSchedule) {
    throw new Error('Failed to create schedule');
  }

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
  findDetailedScheduleById,
  findScheduleByTeamId,
  findScheduleByUserId,
  findScheduleByTeamIdAndUserId,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};