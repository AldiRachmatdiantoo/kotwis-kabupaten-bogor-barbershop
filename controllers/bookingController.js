import * as bookingService from "../services/bookingService.js";

export const index = async (req, res, next) => {
  const getData = await bookingService.getUserBooking(req.user.id);
  res.status(200).json({
    status: "success",
    message: "Data berhasil diambil!",
    data: getData,
  });
};
export const show = async (req, res, next) => {
  const getData = await bookingService.findOneBooking(req.params.id, req.user.id,);
  res.status(200).json({
    status: "success",
    message: "Data berhasil diambil!",
    data: getData,
  });
};
export const store = async (req, res, next) => {
  const storeData = await bookingService.createBooking(req.user.id, req.body);
  res.status(201).json({
    status: "success",
    message: "Berhasil Membuat Booking!",
    data: storeData,
  });
};
export const update = async (req, res, next) => {};
export const destroy = async (req, res, next) => {};
