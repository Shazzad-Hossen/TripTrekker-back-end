import mongoose, { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new Schema(
  { type: { type: String, required: true },
    photos: { type: Array, required: true },
    name: { type: String, required: true },
    division: { type: mongoose.Schema.Types.ObjectId, ref: "Division" },
    place: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
    duration: {
      day: { type: Number },
      night: { type: Number },
    },
    cost: { type: Number, required: true },
    description: { type: String, required: true },
    agency: { type: mongoose.Schema.Types.ObjectId, ref: "Agency" },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
    status: { type: String, enum: ['pending', 'approved','rejected'], default: 'pending'},
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

export default model("Package", schema);
