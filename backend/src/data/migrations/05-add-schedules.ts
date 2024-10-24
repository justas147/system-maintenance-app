import { Knex } from 'knex';
import migrationUtils from '../../utils/migrationUtils';

export async function up(knex: Knex): Promise<void> {
  const schema = migrationUtils.schema(knex);

  await knex.schema.createTable('oncall_schedules', (table) => {
    const columns = schema(table);
    columns.primaryUuid();
    columns.timestamps();

    table.timestamp('startAt').notNullable();
    table.timestamp('endAt').notNullable();
    table.boolean('isActive').defaultTo(true);

    columns.foreignUuid('userId', { column: 'id', table: 'users' }, true);
    columns.foreignUuid('teamId', { column: 'id', table: 'teams' }, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('oncall_schedules');
}