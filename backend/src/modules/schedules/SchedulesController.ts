import { Request } from 'express';
import SchedulesData from './SchedulesData';
import { HttpError } from '../../core/errorHandler';
import { Schedule } from './types/Schedule';
import { pick } from '../../utils/sanitizerUtils';
import SchedulesService from './SchedulesService';
import { getDatesInRange } from '../../utils/dateUtils';
import { MarkedDatesResponse } from './types/ScheduleDto';

const getAll = async (req: Request): Promise<Schedule[]> => {
  const schedules = await SchedulesData.findAll();
  return schedules;
};

const getById = async (req: Request): Promise<Schedule> => {
  const { id } = req.params;

  console.log('Getting schedule by id', id);

  let schedule;
  try {
    schedule = await SchedulesData.findDetailedScheduleById(id);
  } catch (err) {
    throw new HttpError(500, err.message);
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
    throw new HttpError(500, err.message);
  }

  if (!schedules) {
    throw new HttpError(404, 'Schedules not found');
  }

  return schedules;
};

const getByUserId = async (req: Request): Promise<Schedule> => {
  const { userId } = req.params;

  console.log('Getting schedules by user id', userId);

  let schedules;
  try {
    schedules = await SchedulesData.findScheduleByUserId(userId);
  } catch (err) {
    throw new HttpError(500, err.message);
  }

  if (!schedules) {
    throw new HttpError(404, 'Schedules not found');
  }

  return schedules;
};

const create = async (req: Request): Promise<MarkedDatesResponse> => {
  const schedule = pick(req.body, [
    'startAt',
    'endAt',
    'isActive',
    'teamId',
    'userId',
  ]);

  console.log('Creating schedule:', schedule);

  try {
    await SchedulesService.createSchedule({ ...schedule });

    // TODO: refactor to separate calls
    const teamSchedules = await SchedulesService.getTeamScheduleRanges(schedule.teamId);
    return teamSchedules;
  } catch (err) {
    throw new HttpError(500, err.message);
  }
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

const deleteSchedule = async (req: Request): Promise<MarkedDatesResponse> => {
  const { id } = req.params;

  try {
    const teamSchedules = await SchedulesService.deleteSchedule(id);
    return teamSchedules;
  } catch (err) {
    if (err.message === 'Schedule not found') {
      throw new HttpError(404, 'Schedule not found');
    }

    throw new HttpError(500, err.message);
  }
};

const getTeamScheduleDateList = async (req: Request): Promise<Date[]> => {
  const { userId, teamId } = req.params;
  const teamSchedules = await SchedulesData.findScheduleByTeamId(teamId);

  try {
    const now = new Date();
    const oldestAllowedDate = new Date(now.setMonth(now.getMonth() - 5));
  
    const dateList: Date[] = [];
    for (let i = 0; i < teamSchedules.length; i++) {
      const schedule = teamSchedules[i];
  
      // exclude schedules that are older than 5 months
      if (schedule.endAt < oldestAllowedDate) {
        continue;
      }
  
      const dates = getDatesInRange(schedule.startAt, schedule.endAt);
      dateList.push(...dates);
    }
  
    return dateList;
  } catch (err) {
    throw new HttpError(500, err.message);
  }
}

const getTeamScheduleRanges = async (req: Request): Promise<MarkedDatesResponse> => {
  const { userId, teamId } = req.params;
  console.log('Getting team schedule ranges', teamId);
  try {
    const dateList = await SchedulesService.getTeamScheduleRanges(teamId);

    return dateList;
  } catch (err) {
    if (err.message === 'Team not found') {
      throw new HttpError(404, 'Team not found');
    }
    console.error(err.message);
    throw new HttpError(500, err.message);
  }
}

export default {
  getAll,
  getById,
  getByTeamId,
  getByUserId,
  create,
  update,
  deleteSchedule,
  getTeamScheduleDateList,
  getTeamScheduleRanges,
};
