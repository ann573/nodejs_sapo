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

    return await Product.find(query)
    .limit(limit)
    .skip(skip)
    .populate({
      path: 'variants',  // Populate trường variants
      populate: {        // Populate trường attribute bên trong mỗi variant
        path: 'attribute',
        select: 'name attributeId'
      }
    });
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


export const findProduct = async (string) => {
  try {
    const products = await Product.find({
      sort_title: { $regex: string, $options: "i" },
    }).populate({
      path: "variants",
      populate: {
        path: "attribute",
        select: "name",
        populate: {
          path: "attributeId",
          select: "name",
        },
      },
    });
    return products;
  } catch (error) {
    console.log(error);
  }
};

export const findProductByID = async (string) => {
  try {
    return await Product.findById(string).populate({
      path: "variants",
      populate: {
        path: "attribute",
      },
    });
  } catch (error) {
    console.log(error);
  }
};

