import mongoose, { Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const schema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      default: "user",
      enum: ["user", "super-admin", "admin", "hotel", "agency"],
    },
    avatar: { type: String, default: "" },
    gender: { type: String, enum: ["male", "female", "other"] },
    phone: { type: String },
    nid: { type: String },
    street: { type: String },
    city: { type: String },
    zip: { type: Number },
    verified: { type: Boolean, default: false },
    agency: { type: mongoose.Schema.Types.ObjectId, ref: "Agency" },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
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
  return JSON.parse(JSON.stringify(obj).replace(/_id/g, 'id'));
};

export default model('User', schema);