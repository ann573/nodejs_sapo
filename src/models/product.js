import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
    },
    sort_title: {
      type: String,
      required: true,
      minlength: [3, "Mã sản phẩm cần tối thiểu 3 ký tự"],
    },
    variants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
