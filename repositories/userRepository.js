import { conn as knex } from "../connection.js";

export const findOne = (id)=> {
    return knex("users").select("*").where("id", id).first();
}