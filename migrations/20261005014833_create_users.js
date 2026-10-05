/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
  return knex.schema.createTable("users", function(table){
    table.increments();
    table.string("name").notNullable();
    table.string("password").notNullable();
    table.string("phone").notNullable();
    table.string("address").nullable();
    table.enu("role", ["customer", "admin", "manager"]);
    table.timestamps();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
  return knex.schema.dropTableIfExists("users");
};
