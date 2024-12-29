import { Knex } from 'knex';
import { users } from './01-users';
import { teams } from './02-teams';

const date = new Date();
const eigthDaysAgo = new Date(date);
eigthDaysAgo.setDate(eigthDaysAgo.getDate() - 8);
const sevenDaysAgo = new Date(date);
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
const anotherSevenDaysAgo = new Date(eigthDaysAgo);
anotherSevenDaysAgo.setDate(anotherSevenDaysAgo.getDate() - 7);

const schedules = [
  {
    id: '88172e72-b5b8-479e-b797-806bccac5e16',
    userId: users[0].id,
    teamId: teams[0].id,
    startAt: sevenDaysAgo,
    endAt: date,
    isActive: true,

  },
  {
    id: 'ccd7bb23-cdc5-41b5-9c28-40dc9f324c49',
    userId: users[1].id,
    teamId: teams[0].id,
    startAt: anotherSevenDaysAgo,
    endAt: eigthDaysAgo,
    isActive: true,
  }
];

export async function seed(knex: Knex): Promise<void> {
  for (const schedule of schedules) {
    const scheduleExists = await knex('oncall_schedules')
      .where('id', schedule.id)
      .first();

    if (scheduleExists) {
      continue;
    }

    // Inserts seed entries
    await knex('oncall_schedules').insert({
      ...schedule,
    });
  }
}