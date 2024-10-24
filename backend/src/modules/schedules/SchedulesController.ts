import { Request } from 'express';
import SchedulesData from './SchedulesData';
import { HttpError } from '../../core/errorHandler';
import { Schedule } from './types/Schedule';
import { pick } from '../../utils/sanitizerUtils';
import SchedulesService from './SchedulesService';

const getAll = async (req: Request): Promise<Schedule[]> => {
  const schedules = await SchedulesData.findAll();
  return schedules;
};

const getById = async (req: Request): Promise<Schedule> => {
  const { id } = req.params;

  let schedule;
  try {
    schedule = await SchedulesData.findScheduleById(id);
  } catch (err) {
    throw new HttpError(500, 'Server error');
  }

  if (!schedule) {
    throw new HttpError(404, 'Schedule not found');
  }

  return schedule;
};

const getByTeamId = async (req: Request): Promise<Schedule> => {
  const { teamId } = req.params;

  let schedules;
  try {
    schedules = await SchedulesData.findScheduleByTeamId(teamId);
  } catch (err) {
    throw new HttpError(500, 'Server error');
  }

  if (!schedules) {
    throw new HttpError(404, 'Schedules not found');
  }

  return schedules;
};

const getByUserId = async (req: Request): Promise<Schedule> => {
  const { userId } = req.params;

  let schedules;
  try {
    schedules = await SchedulesData.findScheduleByUserId(userId);
  } catch (err) {
    throw new HttpError(500, 'Server error');
  }

  if (!schedules) {
    throw new HttpError(404, 'Schedules not found');
  }

  return schedules;
};

const create = async (req: Request): Promise<Schedule> => {
  const { teamId, userId } = req.params;
  const schedule = pick(req.body, [
    'startTime',
    'endTime',
    'isActive',
  ]);

  const newSchedule = await SchedulesService.createSchedule({ ...schedule, teamId, userId });
  return newSchedule;
};

const update = async (req: Request): Promise<Schedule> => {
  const { id } = req.params;
  const scheduleUpdates = pick(req.body, [
    'startTime',
    'endTime',
    'isActive',
  ]);

  const updatedSchedule = await SchedulesData.updateSchedule(id, scheduleUpdates);
  return updatedSchedule;
};

const deleteSchedule = async (req: Request): Promise<void> => {
  const { id } = req.params;
  await SchedulesData.deleteSchedule(id);
};

export default {
  getAll,
  getById,
  getByTeamId,
  getByUserId,
  create,
  update,
  deleteSchedule,
};
