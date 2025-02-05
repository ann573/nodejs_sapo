import mongoose, { Schema } from "mongoose";
import { decreaseQuantity } from "../services/productService.js";
import { changeScore } from "../services/CustomerService.js";

const productInOrderSchema = new Schema(
  {
    name: String,
    price: Number,
    quantity: Number,
    id: Schema.Types.ObjectId,
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    products: [productInOrderSchema],
    total: Number,
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

orderSchema.pre("save", async function (next) {
  this.total = this.products.reduce(
    (total, product) => total + product.quantity * product.price,
    0
  );
  next();
});

orderSchema.post("save", async function (next) {
  this.products.forEach((item) => {
    decreaseQuantity(item.id, item.quantity);
  });
  if (this.customer) {
    changeScore(this.customer, item.id)
  }
});
const Order = mongoose.model("Order", orderSchema);

export default Order;
