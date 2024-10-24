import { Knex } from 'knex';
import migrationUtils from '../../utils/migrationUtils';

export async function up(knex: Knex): Promise<void> {
  const schema = migrationUtils.schema(knex);

  await knex.schema.createTable('alerts', (table) => {
    const columns = schema(table);
    columns.primaryUuid();
    columns.timestamps();

    table.boolean('isHandled').defaultTo(false);
    table.boolean('isEscalated').defaultTo(false);
    table.timestamp('alertTime').defaultTo(knex.fn.now());
    table.text('alertMessage').nullable();
    table.string('alertSource').nullable
    table.string('alertType').nullable();
    table.timestamp('responseDeadline').nullable();
    table.timestamp('handledAt').nullable();

    columns.foreignUuid('handledBy', { column: 'id', table: 'users' }, false);
    columns.foreignUuid('teamId', { column: 'id', table: 'teams' }, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('alerts');
}