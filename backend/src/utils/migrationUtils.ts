import { Knex } from "knex";

export const handlePrimaryUuid =
  (knex: Knex, table: Knex.TableBuilder) =>
  (column?: string): Knex.ColumnBuilder =>
    table
      .uuid(column || "id")
      .primary()
      .notNullable()
      .unique();

export const handleForeignUuid =
  (table: Knex.TableBuilder) =>
  (column: string, reference: { column: string; table: string }, required?: boolean): Knex.ColumnBuilder => {
    const col = table.uuid(column);
    if (required) {
      col.notNullable();
    }
    table.foreign(column).references(reference.column).inTable(reference.table);
    return col;
  };

export const handleTimestamps = (knex: Knex, table: Knex.TableBuilder) => (): void => {
  table.timestamp("createdAt").defaultTo(knex.fn.now());
  table.timestamp("updatedAt").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
};

export const handleSoftDeleteFlag = (table: Knex.TableBuilder) => (): void => {
  table.timestamp("deletedAt").nullable();
};

type schemaType = {
  primaryUuid: (column?: string) => Knex.ColumnBuilder;
  foreignUuid: (column: string, reference: { column: string; table: string }, required?: boolean) => Knex.ColumnBuilder;
  timestamps: () => void;
  softDeleteFlag: () => void;
};

export const schema = (knex: Knex) => {
  return (table: Knex.TableBuilder): schemaType => {
    return {
      primaryUuid: handlePrimaryUuid(knex, table),
      foreignUuid: handleForeignUuid(table),
      timestamps: handleTimestamps(knex, table),
      softDeleteFlag: handleSoftDeleteFlag(table),
    };
  };
};

export default { handlePrimaryUuid, handleForeignUuid, schema };
