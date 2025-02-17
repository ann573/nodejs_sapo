import mongoose, { Schema } from "mongoose";

const attributeValueSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    attributeId: {
      type: Schema.Types.ObjectId,
      ref: "Attribute",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const AttributeValue = mongoose.model("AttributeValue", attributeValueSchema)

export default AttributeValue
