import mongoose, { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new Schema(
  {
    type: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "processing", "confirmed", "cancelled"],
      default: "pending",
    },
    package: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userId: { type: String },
    agency: { type: String },
    hotel: { type: String },
    person: { type: Number },
    room: { type: Number },
    date: { type: Date },
    endDate: { type: Date },
    duration: { type: Number },
    cost: { type: Number, default: 0 },
  },
  { timestamps: true }
);

schema.plugin(paginate);
schema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  delete obj.updatedAt;
  delete obj.password;
  delete obj.notifySubs;
  return JSON.parse(JSON.stringify(obj).replace(/_id/g, "id"));
};

export default model("Order", schema);
