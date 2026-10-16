import { AppError } from "../utils/AppError.js";
import * as serviceRepository from "../repositories/serviceRepository.js";

export const all = async () => {
  const getData = await serviceRepository.findAll();
  return getData;
};
export const getOne = async (id) => {
  const getData = await serviceRepository.findOne(id);
  if (!getData) throw AppError.notFound("Data tidak ditemukan");
  return getData;
};
export const create = async (rawData) => {
  const { name, category, status, description, price} = rawData;
  if (!name || !category || !status || !price) throw AppError.badRequest("Input Kosong");
  if (name.length < 3 || category.length < 3)
    throw AppError.badRequest("nama/kategori terlalu pendek");
  const insertData = await serviceRepository.insertData({
    name: name.trim(),
    category: category.trim(),
    status: status,
    description: description ? description.trim() : "",
    price: price
  });
  return insertData;
};
export const updateData = async (id, rawData) => {
  const { name, category, status, description, price} = rawData;
  if (!(await getOne(id))) throw AppError.notFound("ID Tidak Ditemukan!");
  const payload = ["name", "category", "status", "description", "price"];
  const checkData = Object.keys(rawData).some((key) => !payload.includes(key));
  if (checkData) throw AppError.badRequest("Data Salah!");
  if ((name && name.length < 3) || (category && category.length < 3))
    throw AppError.badRequest("nama/kategori terlalu pendek");
  const updateData = await serviceRepository.changeData(id, {
    name: name ? name.trim() : name,
    category: category ? category.trim() : category,
    status: status,
    description: description ? description.trim() : description,
    price: price ? price : price
  });
  return updateData;
};
export const deleteData = async (id) => {
  const del = await serviceRepository.delData(id);
  if (del === 0) throw AppError.notFound("ID tidak ditemukan!");
  return del;
};
