import Customer from "../models/customer.js";
import { mongoose } from "mongoose";

export const fetchAllCustomer = async (limit, skip, tel, sort) => {
  try {
    let query = {};
    let desc = {};
    if (tel) {
      query.telephone = {
        $regex: tel,
        $options: "i",
      };
    }

    if (Number(sort) === 0) {
      desc = {createdAt: -1}
    } else if ((Number(sort) === 1)) {
      desc = {score: 1}
    } else desc = {score: -1}
    return await Customer.find(query).limit(limit).skip(skip).sort(desc);
  } catch (error) {
    console.log(error);
  }
};

export const fetchCustomerById = async (id) => {
  try {
    const data = await Customer.findById(id).populate("orders", "total");
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const addCustomer = async (dataBody) => {
  try {
    const data = await Customer.create(dataBody);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editCustomer = async (id, dataBody) => {
  try {
    const data = await Customer.findByIdAndUpdate(id, dataBody, {
      timestamps: true,
      new: true,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const findCustomer = async (tel) => {
  try {
    const data = await Customer.find({
      telephone: {
        $regex: tel,
        $options: "i",
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editIsUsedScore = async (score, id) => {
  try {
    const data = await Customer.findByIdAndUpdate(
      id,
      { $inc: { isUsed: score } },
      { new: true }
    );

    return data;
  } catch (error) {
    console.error("Error updating customer score:", error);
    throw error;
  }
};

export const changeScoreAndAddOrder = async (id, idOrder) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(idOrder)
    ) {
      console.log("ID khách hàng hoặc ID đơn hàng không hợp lệ");
      return;
    }

    const customer = await Customer.findById(id).populate("orders");
    if (!customer) {
      console.log("Không tìm thấy khách hàng");
      return;
    }

    if (!customer.orders.some(order => order._id.toString() === idOrder)) {
      customer.orders.push(idOrder);
      await customer.save();
    }

    const updatedCustomer = await Customer.findById(id).populate("orders");
    const totalSpent = updatedCustomer.orders.reduce((sum, order) => {
      if (typeof order.total === 'number' && !isNaN(order.total)) {
        return sum + order.total;
      }
      return sum; 
    }, 0);

    const score = Math.floor(totalSpent / 200000) - updatedCustomer.isUsed;

    updatedCustomer.score = score;
    await updatedCustomer.save();

    return updatedCustomer.score;
  } catch (error) {
    console.error("Lỗi khi cập nhật điểm tích lũy:", error);
  }
};

export const removeCustomer = async (id) => {
  try {
    const data = await Customer.findByIdAndDelete(id)
    return data
  } catch (error) {
    console.error("Lỗi khi cập nhật điểm tích lũy:", error);

  }
}
