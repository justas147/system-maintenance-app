import { Knex } from 'knex';
import migrationUtils from "../../utils/migrationUtils";

export async function up(knex: Knex): Promise<void> {
  const schema = migrationUtils.schema(knex);

  await knex.schema.createTable('teams', (table) => {
    const columns = schema(table);
    columns.primaryUuid();
    columns.timestamps();

    table.string('name').notNullable();
    table.string('webhookToken').nullable();
    table.string('notificationType').notNullable().defaultTo('push-notification');
    table.json('configuration').nullable();
  });
};

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('teams');
};