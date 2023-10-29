import mongoose, { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new Schema(
  {
    logo: { type: String, default: "" },
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    email: { type: String, required: true },
    lisence: { type: String, required: true },
    division: { type: mongoose.Schema.Types.ObjectId, ref: "Division" },
    place: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
    address: { type: String, required: true },
    latitude: { type: Number, default: 23.808133191050228 },
    longitude: { type: Number, default: 90.4152417524026 },
    documents: [
      {
        name: { type: String, required: true },
        path: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["approved", "pending", "declined", "banned"],
      default: "pending",
    },
  },
  { timestamps: true }
);

schema.plugin(paginate);
schema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.password;
  delete obj.notifySubs;
  return JSON.parse(JSON.stringify(obj).replace(/_id/g, "id"));
};

export default model("Hotel", schema);
