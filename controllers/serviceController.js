import * as serviceService from "../services/serviceService.js";

export const index = async (req, res, next) => {
  const data = await serviceService.all();
  res.status(200).json({
    status: "success",
    message: "data berhasil diambil",
    data: data,
  });
};
export const show = async (req, res, next) => {
  const data = await serviceService.getOne(req.params.id);
  res.status(200).json({
    status: "success",
    message: "data berhasil diambil",
    data: data,
  });
};
export const store = async (req, res, next) => {
  const data = await serviceService.create(req.body);
  res.status(201).json({
    status: "success",
    message: "data berhasil ditambahkan",
    data: data,
  });
};
export const update = async (req, res, next) => {
  const data = await serviceService.updateData(req.params.id, req.body);
  res.status(200).json({
    status: "success",
    message: "data berhasil diperbarui",
    data: data,
  });
};
export const destroy = async (req, res, next) => {
  const data = await serviceService.deleteData(req.params.id);
  res.status(200).json({
    status: "success",
    message: "data berhasil dihapus!",
    data: data,
  });
};
