import { HttpError } from "../../core/errorHandler";
import TeamMemberData from "./data/TeamMemberData";
import ScheduleData from "../schedules/SchedulesData";

import { NewTeamMember, TeamMember, TeamMemberUpdate } from "./types/TeamMember";
import { checkIfDateIsInRange } from "../../utils/dateUtils";

const getById = async (id: string): Promise<any | null> => {
  const teamMember = await TeamMemberData.findDetailedById(id);
  return teamMember;
};

const createTeamMember = async (NewTeamMemberData: NewTeamMember) => {
  const existingMember = await TeamMemberData.findTeamMember(
    NewTeamMemberData.teamId, 
    NewTeamMemberData.userId
  );

  if (existingMember) {
    throw new HttpError(400, 'User already in team');
  }

  const newTeamMember = await TeamMemberData.addTeamMember(NewTeamMemberData);
  return newTeamMember;
};

const updateTeamMember = async (
  teamId: string, 
  userId: string, 
  updates: TeamMemberUpdate
): Promise<TeamMember> => {
  const existingMember = await TeamMemberData.findTeamMember(teamId, userId);

  if (!existingMember) {
    throw new HttpError(404, 'Team member not found');
  }

  await TeamMemberData.updateTeamMember(teamId, userId, updates);

  const updatedTeamMember = await TeamMemberData.findById(existingMember.id);

  if (!updatedTeamMember) {
    throw new HttpError(500, 'Failed to update team member');
  }

  return updatedTeamMember;
};

const getNextResponder = async (teamId: string): Promise<any> => {
  const teamMembers = await TeamMemberData.findTeamMembers(teamId);

  // TODO: have a responder queue to handle alerts if the assigned user is not available
  const oldestOnCall = teamMembers.sort((a, b) => {
    if (!a.latestOncall) return 1;
    if (!b.latestOncall) return -1;

    return a.latestOncall.getTime() - b.latestOncall.getTime();
  })[0];

  return oldestOnCall;
}

const getCurrentRecieverId = async (teamId: string): Promise<string | undefined> => {
  const teamMemberSchedules = await ScheduleData.findScheduleByTeamId(teamId);
  const date = new Date();

  const onCall = teamMemberSchedules.find((schedule) => {
    return checkIfDateIsInRange(date, schedule.startAt, schedule.endAt);
  });

  if (!onCall) {
    return undefined;
  }

  return onCall.userId;
}

export default {
  getById,
  createTeamMember,
  updateTeamMember,
  getNextResponder,
  getCurrentRecieverId,
};