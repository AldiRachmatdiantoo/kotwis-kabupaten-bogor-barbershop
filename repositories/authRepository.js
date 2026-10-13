import { conn as knex } from "../connection.js";

export const findUser = async (name) => {
  return await knex("users")
    .select("*")
    .where("name", name)
    .first();
};
export const insertRefreshToken = async (data, refreshToken) => {
  return await knex("refresh_tokens").insert({
    user_id: data.id,
    token: refreshToken,
    expires_at: new Date(data.exp * 1000),
    session_id: data.sessionId
  });
};
export const checkToken = async (token) => {
  return await knex("refresh_tokens").select("*").where("session_id", token).first();
};
export const deleteToken = async (token) => {
  return await knex("refresh_tokens").where("session_id", token).update({
    is_revoked: true,
  });
};
export const checkRevokedToken = async (id) => {
  return await knex("refresh_tokens")
    .select("is_revoked")
    .where("session_id", id)
    .first();
};
