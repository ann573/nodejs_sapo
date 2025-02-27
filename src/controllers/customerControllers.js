import Customer from "../models/customer.js";
import {
  addCustomer,
  fetchAllCustomer,
  fetchCustomerById,
  editCustomer,
  findCustomer,
  removeCustomer
} from "../services/CustomerService.js";
import { errorResponse, successResponse } from "./../utils/returnResponse.js";


export const getAllCustomer = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const skip = parseInt(req.query.skip) || 0;
    const tel = req.query.telephone;
    const sort = req.query.sort || 0;
    const data = await fetchAllCustomer(limit, skip, tel, sort);
    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500);
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchCustomerById(id);
    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500);
  }
};

export const createCustomer = async (req, res) => {
  try {
    const isExist = await Customer.findOne({ telephone: req.body.telephone });
    if (isExist)
      return errorResponse(res, 400, "Khách hàng với số điện thoại đã tồn tại");
    const dataBody = { ...req.body, orders: [], score: 0 };
    const data = await addCustomer(dataBody);
    return successResponse(res, 201, data);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500);
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await editCustomer(id, req.body);
    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500);
  }
};


export const searchCustomer = async (req, res) => {
  try {
    const { tel } = req.query;
    const data = await findCustomer(tel);
    successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500);
  }
};

export const totalCustomer = async (req, res) => {
  try {
    const data = await Customer.countDocuments()
    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500);
  }
}

export const deleteCustomerById = async (req, res) => {
  const {id} = req.params
  try {
    const data = await removeCustomer(id)
    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500);
  }
}