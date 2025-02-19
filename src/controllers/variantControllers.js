import mongoose from "mongoose";
import Product from "../models/product.js";
import { errorResponse, successResponse } from "../utils/returnResponse.js";
import Variant from "./../models/variant.js";
export const getProductVariant = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId).populate({
      path: "variants",
      populate: {
        path: "attribute",
        select: "name",
        populate: {
          path: "attributeId",
          select: "name",
        },
      },
    });

    if (!product) {
      return errorResponse(res, 401, "Product ID không phù hợp");
    }

    const formattedProduct = {
        _id: product._id,
        name: product.name,
        price: 80,
        sort_title: product.sort_title,
        stock: product.variants.reduce((total, variant) => total + variant.stock, 0),
        variants: product.variants.map(variant => ({
          _id: variant._id,
          attributeType: variant.attribute.attributeId.name,
          size: variant.attribute.name,
          stock: variant.stock,
          price: variant.price
        }))
      };
    return successResponse(res, 200, formattedProduct);
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Có lỗi xảy ra");
  }
};

export const createVariant = async (req, res) => {
  try {
    const isExist = await Variant.findOne({
      idProduct: req.body.idProduct,
      attribute: req.body.attribute,
    });
    if (isExist) {
      return errorResponse(res, 201, "Biến thể đã tồn tại với sản phẩm này ");
    }
    const data = await Variant.create(req.body);

    await Product.findByIdAndUpdate(data.idProduct, {
      $addToSet: { variants: data._id },
    });
    return successResponse(res, 201, data);
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Có lỗi xảy ra");
  }
};

export const decreaseQuantity = async (product) => {
  try {
    const idVariant = new mongoose.Types.ObjectId(product.idVariant);
    const abc = await Variant.findOneAndUpdate(
      {
        _id: idVariant,
      },
      {
        $inc: { 
          stock: -product.quantity,
        },
      }, 
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }
};