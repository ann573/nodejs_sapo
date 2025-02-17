import mongoose, { Schema } from "mongoose";

const customerSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    telephone: {
      type: String,
      required: true,
      unique: true,
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    isUsed: {
      type: Number,
      default: 0
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
