import Product from "./../models/product.js";
export const fetchAllProduct = async (limit, skip, sortTitle) => {
  try {
    let query = {};
    if (sortTitle) {
      query.sort_title = {
        $regex: sortTitle,  
        $options: "i",      
      };
    }
    console.log(query);

    return await Product.find(query).limit(limit).skip(skip);
  } catch (error) {
    console.log(error);
  }
};


export const postProduct = async (body) => {
  try {
    return await Product.create(body);
  } catch (error) {
    console.log(error);
  }
};

export const editProduct = async (id, body) => {
  try {
    return await Product.findByIdAndUpdate(id, body, {
      new: true,
      timestamps: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteProduct = async (id) => {
  try {
    return await Product.findByIdAndDelete(id);
  } catch (error) {
    console.log(error);
  }
};

export const decreaseQuantity = async (id, qtt) => {
  try {
    return await Product.findByIdAndUpdate(
      id,
      { $inc: { quantity: -qtt } },
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }
};

export const findProduct = async (string) => {
  try {
    return await Product.find({
      sort_title: {
        $regex: string,
        $options: "i", 
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const findProductByID = async (string) => {
  try {
    return await Product.findById(string);
  } catch (error) {
    console.log(error);
  }
};