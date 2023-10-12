import mongoose, { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new Schema(
  {
    logo: { type: String, default:'' },
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    email: { type: String, required: true },
    lisence: { type: String, required: true },
    address: { type: String, required: true },
    documents: [
      {
        name: { type: String, required: true },
        path: { type: String, required: true },
      },
    ],
    status: { type: String, enum: ["approved", "pending", "declined"], default:'pending' },
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
