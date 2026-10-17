import { conn as knex } from "../connection.js";

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
    const getData = await trx("bookings").select("*").where("id", bookingId).first();
    return getData;
  });
  return booking;
};
