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
  return await knex("bookings")
    .where("bookings.user_id", userId)
    .where("bookings.id", bookingId)
    .leftJoin("users", "bookings.user_id", "users.id")
    .leftJoin("service_bookings", "bookings.id", "service_bookings.booking_id")
    .leftJoin("services", "service_bookings.service_id", "services.id")
    .select(
      "bookings.id as booking_id",
      "bookings.user_id",
      "bookings.price_total",
      "bookings.status",
      "bookings.description",
      "users.name as nama_user",
      "services.name as nama_service",
    );
};

export const createBooking = async (userId, data) => {
  const { description, paid, services} = data;

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
