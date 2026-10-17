import { conn as knex } from "../connection.js";

export const getOneBooking = async (bookingId, userId) => {
  return await knex("bookings")
    .where("bookings.user_id", userId)
    .where("bookings.id", bookingId)
    .leftJoin("users", "bookings.user_id", "users.id")
    .leftJoin("service_bookings", "bookings.id", "service_bookings.booking_id")
    .leftJoin("services", "service_bookings.service_id", "services.id")
    .select(
      "bookings.id as booking_id",
      "bookings.user_id",
      "bookings.price_total as booking_price",
      "bookings.status",
      "bookings.description",
      "users.name as user_name",
      "services.id as service_id",
      "services.name as service_name",
      "services.price as service_price",
      "services.description as service_description",
    );
};

export const makeBooking = async (id, data, servicesData) => {
  const booking = await knex.transaction(async (trx) => {
    const [insertBooking] = await trx("bookings").insert(data);
    const bookingId = insertBooking;

    await Promise.all(
      servicesData.map(async (services) => {
        await trx("service_bookings").insert({
          service_id: services.id,
          booking_id: bookingId,
          price: services.price,
          description: services.description,
        });
      }),
    );
    const getData = await trx("bookings")
      .select("*")
      .where("id", bookingId)
      .first();
    return getData;
  });
  return booking;
};
