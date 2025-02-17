import { errorResponse, successResponse } from "../utils/returnResponse.js";
import AttributeValue from "./../models/attributeValue.js";
export const getAllAttributeValue = async (req, res) => {
  try {
    const data = await AttributeValue.find().populate("attributeId", "name");
    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Có lỗi xảy ra");
  }
};

export const createAttributeValue = async (req, res) => {
  try {
    const data = await AttributeValue.create(req.body);
    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Có lỗi xảy ra");
  }
};

export const removeAttributeValue = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await AttributeValue.findByIdAndDelete(id);
    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Có lỗi xảy ra");
  }
};
