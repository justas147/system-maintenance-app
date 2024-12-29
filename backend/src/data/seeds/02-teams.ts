import { Knex } from 'knex';

export const team = {
    id: 'fca09230-d54c-44d6-8f55-ec32aee0ff63',
    name: 'Team Alpha',
    configuration: JSON.stringify({ notificationsEnabled: true }),
};

export const teams = [
  {
    id: 'fca09230-d54c-44d6-8f55-ec32aee0ff63',
    name: 'Team Alpha',
    notificationType: 'push-notification',
  },
  {
    id: 'fca09230-d54c-44d6-8f55-ec32aee0ff64',
    name: 'Team Beta',
    notificationType: 'push-notification',
  }
];

export async function seed(knex: Knex): Promise<void> {
  for (const team of teams) {
    const teamExists = await knex('teams').where('name', team.name).first();

    if (teamExists) {
      return;
    }
  
    // Inserts seed entries
    await knex('teams').insert(team);
  }
}