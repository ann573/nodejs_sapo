import { errorResponse, successResponse } from "../utils/returnResponse.js";
import AttributeValue from "./../models/attributeValue.js";
import { checkExistAttribute } from "./variantControllers.js";
export const getAllAttributeValue = async (req, res) => {
  try {
    const data = await AttributeValue.find().populate("attributeId", "name");
    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Có lỗi xảy ra");
  }
};

export const createAttributeValue = async (req, res) => {
  try {
    const data = await AttributeValue.create(req.body);
    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Có lỗi xảy ra");
  }
};

export const removeAttributeValue = async (req, res) => {
  try {
    const { id } = req.params;
    const isExist = await checkExistAttribute(id)
    if (isExist && isExist.stock > 0) {
      return errorResponse(res, 400, "Sản phẩm với biến thể này vẫn còn hàng, không thể xóa được")
    }
    const data = await AttributeValue.findByIdAndDelete(id);
    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Có lỗi xảy ra");
  }
};

export const getAttributeValueById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await AttributeValue.find({
      attributeId: id,
    });
    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
  }
};

export const editAttributeValueById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await AttributeValue.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
  }
};
