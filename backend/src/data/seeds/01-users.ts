import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export const users = [
  {
    id: 'efa9b7d1-50ee-421d-9224-24509645900f',
    name: 'John Doe',
    email: 'john.doe@example.com',
    isSuperAdmin: true,
    pushNotificationToken: "ExponentPushToken[hW0DMPHnu51FjP6XEaBnSi]"
  },
  {
    id: '3573a297-94ff-4eb8-93e7-f0e154454525',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    pushNotificationToken: "ExponentPushToken[Q62XtwIS68ajOIAaK4errv]"
  }
];

export async function seed(knex: Knex): Promise<void> {
  for (const user of users) {
    const userExists = await knex('users').where('email', user.email).first();

    if (userExists) {
      continue;
    }

    // Inserts seed entries
    await knex('users').insert({
      ...user,
      password: bcrypt.hashSync('password', 10),
    });
  }
}
