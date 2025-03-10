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
      stock: product.variants.reduce(
        (total, variant) => total + variant.stock,
        0
      ),
      variants: product.variants.map((variant) => ({
        _id: variant._id,
        attributeType: variant.attribute.attributeId.name,
        size: variant.attribute.name,
        stock: variant.stock,
        price: variant.price,
      })),
    };
    return successResponse(res, 200, formattedProduct);
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Có lỗi xảy ra");
  }
};

export const createVariant = async (req, res) => {
  try {
    // Kiểm tra các biến thể đã tồn tại
    const existingVariants = await Variant.find({
      idProduct: req.body.idProduct,
      attribute: { $in: req.body.map((v) => v.attribute) },
    });

    if (existingVariants.length > 0) {
      return errorResponse(res, 201, "Một hoặc nhiều biến thể đã tồn tại.");
    }

    // Thêm nhiều biến thể cùng lúc
    const variants = await Variant.insertMany(req.body);

    // Lấy danh sách các _id của biến thể vừa thêm
    const variantIds = variants.map((variant) => variant._id);

    // Cập nhật sản phẩm, thêm các _id vào mảng 'variants'
    await Product.findByIdAndUpdate(req.body[0].idProduct, {
      $addToSet: { variants: { $each: variantIds } },
    });

    return successResponse(res, 201, variants);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Có lỗi xảy ra");
  }
};

export const decreaseQuantity = async (product) => {
  try {
    const idVariant = new mongoose.Types.ObjectId(product.idVariant);
    await Variant.findOneAndUpdate(
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


export const checkExistAttribute = async (string) => {
  try {
    const data = await Variant.findOne({ attribute: string });
    return data;
  } catch (error) {
    console.log(error);
  }
};


export const updateVariant = async (req, res) => {
  try {
    const { productId } = req.params;

    // Kiểm tra và chuyển đổi productId hợp lệ
    const validProductId = mongoose.Types.ObjectId.isValid(productId)
      ? new mongoose.Types.ObjectId(productId)
      : null;

    if (!validProductId) {
      return res.status(400).json({ message: "Product ID không hợp lệ!" });
    }

    // Lấy danh sách variant cần xóa
    const variantsToDelete = await Variant.find({
      idProduct: validProductId,
    }).select("_id");
    const variantIds = variantsToDelete.map((variant) => variant._id);

    // Xóa các variant cũ
    await Variant.deleteMany({ _id: { $in: variantIds } });

    // Thêm mới các variant
    const newVariants = req.body.map((variant) => ({
      ...variant,
      idProduct: validProductId, // Gắn idProduct cho các variant mới
    }));

    const variants = await Variant.insertMany(newVariants);

    const variantIdPush = variants.map((variant) => variant._id);

    // Cập nhật lại mảng variants trong Product
    await Product.updateOne(
      { _id: validProductId },
      {
        $set: { variants: variantIdPush },
      }
    );

    return successResponse(res, 201, variants, "Thay đổi thành công");
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Có lỗi xảy ra, vui lòng thử lại sau");
  }
};

