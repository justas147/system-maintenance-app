import { StateCreator } from "zustand";
import TeamService from "../services/teams";

export interface Team {
  id: string;
  name: string;
  notificationType?: string;
  members: string[];
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface NewTeam {
  name: string;
  notificationType?: string;
}

export type TeamMemberDto = {
  userId: string;
  role: string;
};

export type TeamDto = Team & {
  members: TeamMemberDto[];
}

export interface TeamSelect {
  id: string;
  name: string;
  role: string;
}

export interface TeamSlice {
  teams: Team[];
  teamSelect: TeamSelect[] | [];
  selectedTeam: TeamSelect | null;
  teamError: string;
  isLoadingTeams: boolean;
  setSelectTeams: (teams: TeamSelect[]) => void;
  setSelectTeam: (team: TeamSelect) => void;
  fetchTeam(id: string): Promise<TeamDto>;
  createTeam: (team: NewTeam, userId: string) => void;
  addTeam: (team: Team) => void;
  removeTeam: (id: string) => void;
  updateTeam: (id: string, team: Team) => void;
  clearTeams: () => void;
}

export const createTeamSlice: StateCreator<
  TeamSlice,
  [],
  [],
  TeamSlice
> = (set, get) => ({
  teams: [],
  teamSelect: [],
  selectedTeam: null,
  teamError: "",
  isLoadingTeams: false,
  setSelectTeams: (teams: TeamSelect[]) => {
    console.log("Teams: ", teams);
    set({ teamSelect: teams });
  },
  setSelectTeam: (team: TeamSelect) => {
    console.log("Team selected: ", team);
    set({ selectedTeam: team });
  },
  fetchTeam: async (id: string) => {
    set({ isLoadingTeams: true });

    try {
      const team = await TeamService.fetchTeam(id);

      if (!team) {
        throw new Error("Team not found");
      }
  
      set({ 
        isLoadingTeams: false,
        teamError: "",
      });
      return team;
    } catch (error) {
      set({ 
        teamError: "Failed to fetch team",
        isLoadingTeams: false,
      });
    }
  },
  addTeam: (team: Team) => set((state) => ({ teams: [...state.teams, team] })),
  createTeam: async (team: NewTeam, userId: string) => {
    set({ isLoadingTeams: true });

    try {
      const newTeam = await TeamService.createTeam(team, userId);

      if (!newTeam) {
        throw new Error("Failed to create team");
      }

      set({ 
        isLoadingTeams: false,
        teamError: "",
        teams: [...get().teams, newTeam],
      });
    } catch (error) {
      set({ 
        teamError: "Failed to create team",
        isLoadingTeams: false,
      });
    }
  },
  removeTeam: (id: string) => set((state) => ({ teams: state.teams.filter((team) => team.id !== id) })),
  updateTeam: (id: string, team: Team) => async () => {
    set({ isLoadingTeams: true });

    try {
      const updatedTeam = await TeamService.updateTeam(id, team);

      if (!updatedTeam) {
        throw new Error("Failed to update team");
      }

      const currentTeams = get().teams;
      set({ 
        selectedTeam: updatedTeam,
        teams: currentTeams.map((t) => t.id === id ? updatedTeam : t),
        teamError: "",
      });
    } catch (error) {
      set({ 
        teamError: "Failed to update team",
        isLoadingTeams: false,
      });
    }
  },
  clearTeams: () => set({ teams: [] }),
});
