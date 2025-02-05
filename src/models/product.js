import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sort_title: {
    type: String,
    required: true,
    minlength: [3, "Mã sản phẩm cần tối thiểu 3 ký tự"],
  },
  quantity: {
    type: Number,
    required: true,
  }
},{
  timestamps: true,
  versionKey: false
});

const Product = mongoose.model("Product", productSchema);

export default Product;
