import { HttpError } from "../../core/errorHandler";
import TeamMemberData from "./data/TeamMemberData";
import { NewTeamMember, TeamMember, TeamMemberUpdate } from "./types/TeamMember";

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

  const updatedTeamMember = await TeamMemberData.updateTeamMember(teamId, userId, updates);
  return updatedTeamMember;
};

const getNextResponder = async (teamId: string): Promise<TeamMember> => {
  const teamMembers = await TeamMemberData.findTeamMembers(teamId);

  // TODO: have a responder queue to handle alerts if the assigned user is not available
  const oldestOnCall = teamMembers.sort((a, b) => {
    if (!a.latestOncall) return 1;
    if (!b.latestOncall) return -1;

    return a.latestOncall.getTime() - b.latestOncall.getTime();
  })[0];

  return oldestOnCall;
}

export default {
  createTeamMember,
  updateTeamMember,
  getNextResponder,
};