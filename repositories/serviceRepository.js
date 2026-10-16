import { conn as knex } from "../connection.js";

export const findAll = async () => {
  return await knex("services").select("*");
};
export const findOne = async (id) => {
  return await knex("services").select("*").where("id", id).first();
};
export const insertData = async (data) => {
  const [insertData] = await knex("services").insert(data);
  const getData = await knex("services")
    .select("*")
    .where("id", insertData)
    .first();
  return getData;
};
export const changeData = async (id, data) => {
  await knex("services").where("id", id).update(data);
  const getData = await knex("services").select("*").where("id", id).first();
  return getData;
};
export const delData = async (id) => {
    return await knex("services").where("id", id).del();
}