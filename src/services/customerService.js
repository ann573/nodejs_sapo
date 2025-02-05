import Customer from "../models/customer.js";

export const fetchAllCustomer = async (limit, skip, tel) => {
  try {
    let query = {};
    if (tel) {
      query.telephone = {
        $regex: tel,
        $options: "i",
      };
    }

    return await Customer.find(query).limit(limit).skip(skip);
  } catch (error) {
    console.log(error);
  }
};

export const fetchCustomerById = async (id) => {
  try {
    const data = await Customer.findById(id);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const addCustomer = async (dataBody) => {
  try {
    
    const data = await Customer.create(dataBody);
    console.log(data);
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
      $telephone: {
        $regex: tel,
        $options: "i",
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const changeScore = async (id) => {
  try {
    const customer = await Customer.findById(id).populate("orders");

    if (!customer) {
      console.log("Không tìm thấy khách hàng");
      return;
    }

    const totalAmount = customer.orders.reduce((sum, order) => {
      return sum + order.total;
    }, 0);

    const score = Math.floor(totalAmount / 200000);

    customer.score = score;
    await customer.save();

    console.log(`Điểm tích lũy của khách hàng là: ${score}`);
    return score;
  } catch (error) {
    console.error("Lỗi tính điểm tích lũy và cập nhật điểm:", error);
  }
};
