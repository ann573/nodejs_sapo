import AttributeValue from "../models/attributeValue.js";
import Variant from "../models/variant.js";
import Attribute from "./../models/attribute.js";
import { errorResponse, successResponse } from "./../utils/returnResponse.js";
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

    // Tìm tất cả AttributeValue có attributeId = id
    const idAttributeValue = await AttributeValue.find({
      attributeId: id,
    }).select("_id");
    // Lấy danh sách ID từ idAttributeValue
    const idList = idAttributeValue.map((attr) => attr._id);

    // Kiểm tra xem có Variant nào đang sử dụng các AttributeValue này không
    const isExist = await Variant.aggregate([
      {
        $match: {
          attribute: { $in: idList }, // Kiểm tra xem attribute có nằm trong danh sách idList không
        },
      },
      {
        $project: {
          stock: 1, // Chỉ lấy trường quantity
        },
      },
      {
        $match: {
          stock: { $gt: 0 }, // Lọc các variant có số lượng > 0
        },
      },
    ]);

    // Nếu tồn tại variant có quantity > 0 thì không thể xóa attribute
    if (isExist.length > 0) {
      return errorResponse(
        res,
        500,
        "Vẫn còn sản phẩm với biến thể, không thể xóa"
      );
    }

    // Nếu không có variant nào sử dụng, tiến hành xóa
    // await AttributeValue.deleteMany({ attributeId: id });
    // await Attribute.findByIdAndDelete(id);

    return res.status(200).json({ message: "Xóa thuộc tính thành công!" });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error });
  }
};
