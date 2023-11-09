import mongoose, { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new Schema(
  {
    tran_date: { type: Date, required: true },
    tran_id: { type: String, required: true },
    val_id: { type: String, required: true },
    amount: { type: Number, required: true },
    store_amount: { type: Number, required: true },
    currency: { type: String, required: true },
    bank_tran_id: { type: String },
    card_issuer: { type: String },
    card_brand: { type: String },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    package: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    isRefunded: { type: Boolean, default: false },
    status: { type: String, enum: ['requested', 'refunded', 'cancelled', 'request'], default: 'request'},
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

export default model("Payment", schema);
