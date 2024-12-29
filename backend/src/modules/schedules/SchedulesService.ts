import { getDatesInRange } from "../../utils/dateUtils";
import TeamMemberData from "../../modules/teams/data/TeamMemberData";
import TeamsService from "../../modules/teams/TeamsService";
import SchedulesData from "./SchedulesData";
import { NewSchedule, Schedule } from "./types/Schedule";
import { DateMark, MarkedDates, MarkedDatesResponse } from "./types/ScheduleDto";

const getLastSchedule = async (userId: string, teamId: string) => {
  const memberSchedule = await SchedulesData.findScheduleByTeamIdAndUserId(
    teamId, 
    userId
  );

  const latestSchedule = memberSchedule.reduce((acc, curr) => {
    return acc.startAt > curr.startAt ? acc : curr;
  }, memberSchedule[0]);

  return latestSchedule;
}

const getTeamScheduleRanges = async (teamId: string): Promise<MarkedDatesResponse> => {
  const teamSchedules = await SchedulesData.findScheduleByTeamId(teamId);
  const teamMembers = await TeamMemberData.findTeamMembers(teamId);

  const teamData: Record<string, any> = {};
  teamMembers.forEach((member) => {
    teamData[member.userId] = member;
  });

  const now = new Date();
  const oldestAllowedDate = new Date(now.setMonth(now.getMonth() - 5));

  const dateList: MarkedDates = {};
  for (let i = 0; i < teamSchedules.length; i++) {
    const schedule = teamSchedules[i];

    // exclude schedules that are older than 5 months
    if (schedule.endAt < oldestAllowedDate) {
      continue;
    }

    const dates = getDatesInRange(schedule.startAt, schedule.endAt);

    for (let j = 0; j < dates.length; j++) {
      const date = dates[j];

      const isStartingDay = j === 0;
      const isEndingDay = j === dates.length - 1;
      const dateMark: DateMark = {
        id: schedule.id,
        date,
        color: teamData[schedule.userId].color,
        startingDay: isStartingDay,
        endingDay: isEndingDay,
      };

      const dateKey = date.toISOString().split('T')[0];
      dateList[dateKey] = dateMark;
    }
  }

  return {
    markedDateUsers: teamData,
    markedDates: dateList,
  };
}

const createSchedule = async (
  schedule: NewSchedule
): Promise<Schedule> => {
  const newSchedule = await SchedulesData.createSchedule(schedule);

  const latestSchedule = await getLastSchedule(schedule.userId, schedule.teamId);

  if (!latestSchedule) {
    return newSchedule;
  }

  await TeamsService.updateTeamMember(
    schedule.teamId, 
    schedule.userId,
    {
      lastOnCall: latestSchedule.endAt,
    }
  );
  console.log('Team member updated:', schedule.userId);
  return newSchedule;
};

const deleteSchedule = async (id: string): Promise<MarkedDatesResponse> => {
  console.log('Deleting schedule:', id);
  const schedule = await SchedulesData.findScheduleById(id);
  if (!schedule) {
    throw new Error('Schedule not found');
  }

  await SchedulesData.deleteSchedule(id);

  const latestSchedule = await getLastSchedule(schedule.userId, schedule.teamId);

  if (latestSchedule) {
    await TeamsService.updateTeamMember(
      schedule.teamId, 
      schedule.userId,
      {
        lastOnCall: latestSchedule.endAt,
      }
    );
  }

  // TODO: refactor to separate calls
  const teamSchedules = await getTeamScheduleRanges(schedule.teamId);
  return teamSchedules;
};

export default {
  getTeamScheduleRanges,
  createSchedule,
  deleteSchedule,
};
