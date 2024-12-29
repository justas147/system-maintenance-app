import { NewTeam, Team } from "@/state/teams";
import api from "../utils/api";

const createTeam = async (team: NewTeam, userId: string): Promise<any> => {
  try {
    console.log("Creating team: ", team);
    const response = await api.post("teams", {
      ...team,
      userId,
    });

    if (response.status !== 201) {
      throw new Error(`Failed to create team, response: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const fetchTeam = async (id: string): Promise<any> => {
  try {
    console.log("Fetching team with id: ", id);
    const response = await api.get(`teams/${id}`);

    if (response.status !== 200) {
      throw new Error(`Failed to fetch team, response: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const edit = async (id: string, name: string, email: string): Promise<any> => {
  try {
    console.log("Editing team with id: ", id);
    const response = await api.put(`teams/${id}`, {
      name,
      email,
    });

    if (response.status !== 200) {
      throw new Error(`Failed to edit, response: ${response.status}`);
    }
    
    console.log("Edit user response: ", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const updateTeam = async (id: string, team: Team): Promise<any> => {
  try {
    console.log("Updating team: ", team);
    const response = await api.put(`teams/${team.id}`, team);

    if (response.status !== 200) {
      throw new Error(`Failed to update team, response: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default {
  createTeam,
  fetchTeam,
  edit,
  updateTeam,
}