/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.alterTable("refresh_tokens", (table) => {
    table.string("session_id", 36).nullable().unique();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.alterTable("refresh_tokens", (table) => {
    table.dropUnique(["session_id"]);
    table.dropColumn("session_id");
  });
};
