import { Knex } from 'knex';

export const team = {
    id: 'fca09230-d54c-44d6-8f55-ec32aee0ff63',
    name: 'Team Alpha',
    configuration: JSON.stringify({ notificationsEnabled: true }),
};

export async function seed(knex: Knex): Promise<void> {
  const teamExists = await knex('teams').where('name', team.name).first();

  if (teamExists) {
    return;
  }

  // Inserts seed entries
  await knex('teams').insert(team);
}