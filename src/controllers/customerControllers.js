import Customer from "../models/customer.js";
import {
  addCustomer,
  fetchAllCustomer,
  fetchCustomerById,
  editCustomer,
  findCustomer
} from "../services/CustomerService.js";
import { errorResponse, successResponse } from "./../utils/returnResponse.js";

export const getAllCustomer = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const skip = parseInt(req.query.skip) || 0;
    const tel = req.query.tel;
    const data = await fetchAllCustomer(limit, skip, tel);
    successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500);
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchCustomerById(id);
    successResponse(res, 200, data);
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
    successResponse(res, 201, data);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500);
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await editCustomer(id, req.body);
    successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500);
  }
};


export const searchCustomer = async (req, res) => {
  try {
    const { tel } = req.params;

    const data = await findCustomer(tel);
    successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500);
  }
};
