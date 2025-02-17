import Attribute from "./../models/attribute.js";
import { errorResponse, successResponse } from "./../utils/returnResponse.js";
export const getAllAttribute = async (req, res) => {
  try {
    const data = await Attribute.find();
    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    errorResponse("res", 500, "Có lỗi xảy ra");
  }
};

export const getAttributeById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Attribute.findById(id);
    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    errorResponse("res", 500, "Có lỗi xảy ra");
  }
};

export const createAttribute = async (req, res) => {
  try {
    const data = await Attribute.create(req.body);
    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    errorResponse("res", 500, "Có lỗi xảy ra");
  }
};
