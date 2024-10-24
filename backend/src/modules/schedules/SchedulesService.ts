import TeamsService from "../../modules/teams/TeamsService";
import SchedulesData from "./SchedulesData";
import { NewSchedule, Schedule } from "./types/Schedule";

const createSchedule = async (
  schedule: NewSchedule
): Promise<Schedule> => {
  const newSchedule = await SchedulesData.createSchedule(schedule);

  const memberSchedule = await SchedulesData.findScheduleByTeamIdAndUserId(
    schedule.teamId, 
    schedule.userId
  );

  const latestSchedule = memberSchedule.reduce((acc, curr) => {
    return acc.startTime > curr.startTime ? acc : curr;
  }, memberSchedule[0]);

  if (!latestSchedule) {
    return newSchedule;
  }

  await TeamsService.updateTeamMember(
    schedule.teamId, 
    schedule.userId,
    {
      latestOncall: latestSchedule.endTime,
    }
  );

  return newSchedule;
};

export default {
  createSchedule,
};
