import { StateCreator } from "zustand";
import { TeamSelect } from "./teams";
import AuthService from "../services/auth";
import UserService from "../services/user";

export interface User {
  id: string;
  email: string;
  name: string;
  teamIds: TeamSelect[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface UserSlice {
  user: User | null;
  fetchUser: () => Promise<User>;
  editUser: (id: string, name: string, email: string) => Promise<User>;
  clearUser: () => void;
}

export const createUserSlice: StateCreator<
  UserSlice,
  [],
  [],
  UserSlice
> = (set) => ({
  user: null,
  fetchUser: async () => {
    const userProfile: User | undefined = await AuthService.profile();

    if (!userProfile) {
      throw new Error("User not found");
    }

    set({ user: userProfile });
    return userProfile;
  },
  editUser: async (id: string, name: string, email: string) => {
    // TODO: redo to not pass id
    const userProfile: User | undefined = await UserService.edit(id, name, email);

    if (!userProfile) {
      throw new Error("User not found");
    }
    console.log("Updated user profile: ", userProfile);
    set({ user: userProfile });
    return userProfile;
  },
  clearUser: () => set({ user: null }),
});