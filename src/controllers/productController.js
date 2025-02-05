import mongoose from "mongoose";
import {
  editProduct,
  fetchAllProduct,
  findProduct,
  findProductByID,
  postProduct,
} from "../services/productService.js";
import { errorResponse, successResponse } from "../utils/returnResponse.js";

export const getAllProduct = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;
    const sortTitle = req.query.sort_title 
    const product = await fetchAllProduct(limit , skip , sortTitle);
    successResponse(res, 200, product);
  } catch (error) {
    console.log(error);
  }
};

export const getProductByID = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await findProductByID(id);
    successResponse(res, 200, products);
  } catch (error) {}
};

export const createProducts = async (req, res) => {
  if (req.role !== "boss") {
    return errorResponse(res, 400, "Bạn không có quyền thao tác");
  }

  try {
    const data = await postProduct(req.body);
    return successResponse(res, 201, data, "Tạo sản phẩm thành công");
  } catch (error) {
    console.log(error);
  }
};

export const updateProducts = async (req, res) => {
  const id = new mongoose.Schema.ObjectId(req.params.id);
  if (req.role !== "boss") {
    return errorResponse(res, 400, "Bạn không có quyền thao tác");
  }

  try {
    const data = await editProduct(id, req.body);
    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
  }
};

export const removeProducts = async (req, res) => {
  const id = new mongoose.Schema.ObjectId(req.params.id);

  try {
    const data = await deleteProduct(id);
    return successResponse(res, 200, data);
  } catch (error) {
    errorResponse(res, 500, "Có lỗi xảy ra");
  }
};

export const searchProducts = async (req, res) => {
  try {
    const data = await findProduct(req.query.sort_title);
    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Có lỗi xảy ra");
  }
};
