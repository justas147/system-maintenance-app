import { Knex } from 'knex';
import migrationUtils from "../../utils/migrationUtils";

export async function up(knex: Knex): Promise<void> {
  const schema = migrationUtils.schema(knex);

  await knex.schema.createTable('users', (table) => {
    const columns = schema(table);
    columns.primaryUuid();
    columns.timestamps();

    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').nullable();
    table.string('googleId').unique();
  });
};

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
};