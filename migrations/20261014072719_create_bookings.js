/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
  return knex.schema.createTable("bookings", function(table){
    table.increments();
    table.integer("user_id").unsigned().notNullable();
    table.foreign("user_id").references("users.id").onDelete("CASCADE");
    table.integer("price_total").notNullable();
    table.timestamp("active_at").notNullable();
    table.string("description").nullable();
    table.enu("status", ["paid", "postpaid"]).defaultTo("paid").notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
  return knex.schema.dropTableIfExists("bookings");
};
