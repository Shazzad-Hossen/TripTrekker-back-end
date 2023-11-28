import mongoose, { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new Schema(
  {
    images: { type: Array, default:[] },
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    comment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Place"}

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

export default model("Post", schema);
