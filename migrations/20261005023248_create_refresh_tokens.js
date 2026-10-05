/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function(knex) {
  return knex.schema.createTable("refresh_tokens", function(table){
    table.increments().primary();
    table.string("token").notNullable();
    table.integer("user_id").unsigned().notNullable();
    table.foreign("user_id").references("users.id").onDelete("CASCADE");
    table.timestamp("expires_at").notNullable();
    table.boolean("is_revoked").defaultTo("false");
    table.timestamps(true, true);
  });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down= function(knex) {
  return knex.schema.dropTableIfExists("refresh_tokens");
};
