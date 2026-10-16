/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
  return knex.schema.createTable("service_bookings", function(table){
    table.increments();
    table.integer("service_id").unsigned().notNullable();
    table.foreign("service_id").references("services.id").onDelete("CASCADE");
    table.integer("booking_id").unsigned().notNullable();
    table.foreign("booking_id").references("bookings.id").onDelete("CASCADE");
    table.integer("price");
    table.string("description").nullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
  return knex.schema.dropTableIfExists("service_bookings");
};
