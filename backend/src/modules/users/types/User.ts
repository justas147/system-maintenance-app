export type User = {
  id: string;
  name: string;
  email: string;
  googleId?: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type NewUser = Omit<User, 'id'>;

export type UserUpdate = Partial<User>;