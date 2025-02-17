import mongoose, { Schema } from "mongoose";

const variantSchema = new mongoose.Schema({
  idProduct: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  attribute: {
    type: Schema.Types.ObjectId,
    ref: "AttributeValue",
  },
  stock: {
    type: Number,
  },
  price: {
    type: Number,
    default: 100000,
  },
},{
  timestamps: true,
  versionKey: false
});

const Variant = new mongoose.model("Variant", variantSchema);

export default Variant;
