import { conn as knex } from "../connection.js";
import { AppError } from "../utils/AppError.js";

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
  const updateData = await knex.transaction(async (trx) => {
    const update = await trx("services").where("id", id).update(data);
    if (update === 0) throw AppError.internal("Transaksi Gagal");

    const getData = await trx("services").select("*").where("id", id).first();
    return getData;
  });
  return updateData;
};
export const delData = async (id) => {
  return await knex("services").where("id", id).del();
};
