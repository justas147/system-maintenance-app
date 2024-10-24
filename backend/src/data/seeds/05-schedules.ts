import { Knex } from 'knex';
import { users } from './01-users';
import { team } from './02-teams';

const date = new Date();
const eigthDaysAgo = new Date(date);
eigthDaysAgo.setDate(eigthDaysAgo.getDate() - 8);
const sevenDaysAgo = new Date(date);
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
const oneDayAgo = new Date(date);
oneDayAgo.setDate(oneDayAgo.getDate() - 1);

const schedules = [
  {
    id: '88172e72-b5b8-479e-b797-806bccac5e16',
    userId: users[0].id,
    teamId: team.id,
    startAt: date,
    endAt: sevenDaysAgo,
    isActive: true,

  },
  {
    id: 'ccd7bb23-cdc5-41b5-9c28-40dc9f324c49',
    userId: users[1].id,
    teamId: team.id,
    startAt: eigthDaysAgo,
    endAt: oneDayAgo,
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