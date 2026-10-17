import { AppError } from "../utils/AppError.js";
import * as userRepository from "../repositories/userRepository.js";
import * as serviceRepository from "../repositories/serviceRepository.js";
import * as bookingRepository from "../repositories/bookingRepository.js";

import { conn as knex } from "../connection.js";
//Get all Bookings by ID
export const getUserBooking = async (id) => {
  return await knex("bookings")
    .where("user_id", id)
    .join("users", "bookings.user_id", "users.id")
    .select(
      "bookings.id as booking_id",
      "bookings.user_id",
      "bookings.price_total",
      "bookings.description",
    );
};
export const findOneBooking = async (bookingId, userId) => {
  const rows = await bookingRepository.getOneBooking(bookingId, userId);
  if (rows.length === 0) return "Belum ada Booking yang dibuat";
  const users = [];
  for (const row in rows) {
    // cek apakah user ada
    let user = users.find((u) => rows[row].user_id === u.id);
    if (!user) {
      user = {
        id: rows[row].user_id,
        name: rows[row].user_name,
        bookings: [],
      };
      users.push(user);
    }
    // cek apakah bookings ada
    let booking = user.bookings.find((b) => rows[row].booking_id === b.id);
    if (user.bookings != null && !booking) {
      booking = {
        id: rows[row].booking_id,
        description: rows[row].description,
        price: rows[row].booking_price,
        services: [],
      };
      user.bookings.push(booking);
    }
    // masukkan services ke booking
    if (
      booking &&
      rows[row].service_id != null &&
      !booking.services.some((s) => rows[row].service_id === s.id)
    ) {
      booking.services.push({
        id: rows[row].service_id,
        name: rows[row].service_name,
        price: rows[row].service_price,
        description: rows[row].service_description,
      });
    }
  }
  return users;
};

export const createBooking = async (userId, data) => {
  const { description, paid, services } = data;

  if (!(await userRepository.findOne(userId)))
    throw AppError.forbidden("ID Salah!");

  const servicesData = [];
  await Promise.all(
    services.map(async (service) => {
      const checkServices = await serviceRepository.findOne(service.id);
      if (!checkServices) {
        throw AppError.notFound("Service Tidak Tersedia!");
      }
      servicesData.push({
        id: checkServices.id,
        price: checkServices.price,
        description: checkServices.description,
      });
    }),
  );
  console.log("\nID Services valid");

  const totalPrice = servicesData.reduce((total, service) => {
    return total + service.price;
  }, 0);
  const setBooking = await bookingRepository.makeBooking(
    userId,
    {
      user_id: userId,
      price_total: totalPrice,
      active_at: new Date(),
      description: description ? description.trim() : "",
      status: paid ? paid.trim() : paid,
    },
    servicesData,
  );
  return setBooking;
};
