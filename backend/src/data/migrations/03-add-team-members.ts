import { Knex } from 'knex';
import migrationUtils from '../../utils/migrationUtils';

export async function up(knex: Knex): Promise<void> {
  const schema = migrationUtils.schema(knex);

  await knex.schema.createTable('team_members', (table) => {
    const columns = schema(table);
    columns.primaryUuid();
    columns.timestamps();

    table.string('role').defaultTo('member');
    table.boolean('isAvailable').defaultTo(true);
    table.timestamp('lastOnCall').nullable();

    columns.foreignUuid('userId', { column: 'id', table: 'users' }, true);
    columns.foreignUuid('teamId', { column: 'id', table: 'teams' }, true);
  });
};

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('team_members');
};