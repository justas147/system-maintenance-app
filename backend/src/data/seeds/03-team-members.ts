import { Knex } from 'knex';
import { users } from './01-users';
import { teams } from './02-teams';

const teamMembers = [
  {
    id: '6ff514ea-3cc3-4500-b6f1-2edbb6b5a164',
    userId: users[0].id,
    teamId: teams[0].id,
    color: '#FF0000',
    role: 'admin',
  },
  {
    id: '1ff3ff93-d596-46cb-8669-e3092135b025',
    userId: users[1].id,
    teamId: teams[0].id,
    role: 'member',
    color: '#00FF00',
  },
  {
    id: '6ff514ea-3cc3-4500-b6f1-2edbb6b5a165',
    userId: users[0].id,
    teamId: teams[1].id,
    color: '#FF0000',
    role: 'admin',
  },
];

export async function seed(knex: Knex): Promise<void> {
  for (const member of teamMembers) {
    const memberExists = await knex('team_members')
      .where('id', member.id)
      .first();

    if (memberExists) {
      continue;
    }

    // Inserts seed entries
    await knex('team_members').insert({
      ...member,
    });
  }
}