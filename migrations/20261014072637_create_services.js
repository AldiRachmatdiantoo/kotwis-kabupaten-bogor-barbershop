/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
  return knex.schema.createTable("services", function(table){
    table.increments();
    table.string("name").notNullable();
    table.string("category").notNullable();
    table.boolean("status").defaultTo("false").notNullable();
    table.string("description").nullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
  return knex.schema.dropTableIfExists("services");
};
