import mongoose, { Schema } from "mongoose";
import {
  changeScoreAndAddOrder,
  editIsUsedScore,
} from "../services/CustomerService.js";
import { decreaseQuantity } from "./../controllers/variantControllers.js";

const productInOrderSchema = new Schema(
  {
    name: String,
    price: Number,
    quantity: Number,
    variant: String,
    _id: Schema.Types.ObjectId,
    idVariant: String,
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
    test: {
      type: String,
    },
    score: {
      type: Number,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

orderSchema.pre("save", async function (next) {
  if (this.customer) {
    editIsUsedScore(Number(this.score), this.customer);
  }
  next();
});

orderSchema.post("save", async function () {
  this.products.forEach((item) => {
    decreaseQuantity(item);
  });

  if (this.customer) {
    changeScoreAndAddOrder(this.customer, this._id);
  }
});
const Order = mongoose.model("Order", orderSchema);

export default Order;
