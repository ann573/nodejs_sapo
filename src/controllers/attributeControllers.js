import AttributeValue from "../models/attributeValue.js";
import Variant from "../models/variant.js";
import Attribute from "./../models/attribute.js";
import { errorResponse, successResponse } from "./../utils/returnResponse.js";
import Product from './../models/product.js';
export const getAllAttribute = async (req, res) => {
  try {
    if (req.role !== "boss")
      return errorResponse(res, 400, "Bạn không có quyền vào trang này");

    const data = await Attribute.find().sort({ createdAt: 1 });
    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Có lỗi xảy ra");
  }
};

export const getAttributeById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Attribute.findById(id);
    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Có lỗi xảy ra");
  }
};

export const createAttribute = async (req, res) => {
  try {
    const data = await Attribute.create(req.body);

    await AttributeValue.create({
      name: "Mặc định",
      attributeId: data._id,
    });

    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Có lỗi xảy ra");
  }
};

export const deleteAttribute = async (req, res) => {
  try {
    const { id } = req.params;

    //  Tìm tất cả AttributeValue có attributeId = id
    const idList = await AttributeValue.find({ attributeId: id }).distinct("_id");

    //  Kiểm tra xem có Variant nào còn stock đang sử dụng AttributeValue này không
    const isExist = await Variant.exists({
      attribute: { $in: idList },
      stock: { $gt: 0 },
    });

    if (isExist) {
      return res.status(400).json({ message: "Vẫn còn sản phẩm với biến thể, không thể xóa" });
    }

    // Tìm danh sách Variant ID cần xóa
    const variantIds = await Variant.find({ attribute: { $in: idList } }).distinct("_id");

    //  Tìm danh sách Product ID cần xóa (có chứa variant bị xóa)
    const productIds = await Product.find({ variants: { $in: variantIds } }).distinct("_id");

    //  Xóa tất cả dữ liệu liên quan trong **một lần** bằng `Promise.all()`
    await Promise.all([
      AttributeValue.deleteMany({ _id: { $in: idList } }),
      Variant.deleteMany({ _id: { $in: variantIds } }),
      Product.deleteMany({ _id: { $in: productIds } }),
      Attribute.findByIdAndDelete(id),
    ]);

    return res.status(200).json({ message: "Xóa thuộc tính thành công!" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi server", error });
  }
};
