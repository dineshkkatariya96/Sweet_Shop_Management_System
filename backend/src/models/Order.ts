// src/models/Order.ts
import mongoose, { Document } from "mongoose";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  sweetId: mongoose.Types.ObjectId;
  quantity: number;
  price?: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new mongoose.Schema<IOrder>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sweetId: { type: mongoose.Schema.Types.ObjectId, ref: "Sweet", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: false }, // optional price field
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
