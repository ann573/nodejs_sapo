import mongoose from "mongoose";
import {
  editProduct,
  fetchAllProduct,
  findProduct,
  findProductByID,
  postProduct,
  deleteProduct
} from "../services/productService.js";
import { errorResponse, successResponse } from "../utils/returnResponse.js";
import Product from "../models/product.js";

export const getAllProduct = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;
    const sortTitle = req.query.sort_title;
    const product = await fetchAllProduct(limit, skip, sortTitle);
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
  } catch (error) {
    console.log(error);
  }
};

export const createProducts = async (req, res) => {
  if (req.role !== "boss") {
    return errorResponse(res, 400, "Bạn không có quyền thao tác");
  }
  const data = await Product.findOne({sort_title: req.body.sort_title})
  if(data) {
    return errorResponse(res, 400, "Mã sản phẩm đã tồn tại")
  }
  try {
    const data = await postProduct(req.body);
    return successResponse(res, 201, data, "Tạo sản phẩm thành công");
  } catch (error) { 
    console.log(error);
  }
};

export const updateProducts = async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
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
  const id = new mongoose.Types.ObjectId(req.params.id);

  try {
    const data = await deleteProduct(id);
    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Có lỗi xảy ra");
  }
};

export const searchProducts = async (req, res) => {
  try {
    const products = await findProduct(req.query.sort_title);

    const formattedProducts = products.map((product) => {

      return {
        _id: product._id,
        name: product.name,
        sort_title: product.sort_title,
        stock: product?.variants.reduce(
          (total, variant) => total + variant.stock,
          0
        ),
        price: 80,
        variants: product?.variants.map((variant) => ({
          _id: variant._id,
          attributeType: variant.attribute.attributeId.name,
          size: variant.attribute.name,
          stock: variant.stock,
          price: variant.price,
        })),
      };
    });
    return successResponse(res, 200, formattedProducts);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Có lỗi xảy ra");
  }
};

export const getTotalProducts = async (req, res) => {
  try {
    const total =  await Product.countDocuments()
    return successResponse(res,200,total)
  } catch (error) {
    console.log(error);
  }


}