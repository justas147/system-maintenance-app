import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { team } from './02-teams';
import moment from 'moment';
import { users } from './01-users';

const date = new Date();
const alerts = [
  {
    id: uuidv4(),
    teamId: team.id,
    alertMessage: 'Server CPU usage high!',
    alertSource: 'Slack',
    handledBy: users[0].id,
    isHandled: true,
    handledAt: date,
  },
  {
    id: uuidv4(),
    teamId: team.id,
    alertMessage: 'Database connection issues detected!',
    alertSource: 'Monitoring Tool',
    alertTime: date,
    handledBy: null,
  }
];

export async function seed(knex: Knex): Promise<void> {
  for (const alert of alerts) {
    const alertExists = await knex('alerts').where('alertMessage', alert.alertMessage).first();

    if (alertExists) {
      continue;
    }

    // Inserts seed entries
    await knex('alerts').insert({
      ...alert,
    });
  }
}