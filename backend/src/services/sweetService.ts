import Sweet, { ISweet } from "../models/Sweet";
import Order from "../models/Order";

export const listSweets = async ({ category, search, page = 1, limit = 10 }: any) => {
  const filter: any = {};
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: "i" };

  const skip = (page - 1) * limit;
  const sweets = await Sweet.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });
  const total = await Sweet.countDocuments(filter);
  return { sweets, total };
};

export const getSweetById = async (id: string) => {
  const s = await Sweet.findById(id);
  if (!s) throw new Error("Sweet not found");
  return s;
};

export const createSweet = async (payload: Partial<ISweet>) => {
  const s = new Sweet(payload);
  await s.save();
  return s;
};

export const updateSweet = async (id: string, payload: Partial<ISweet>) => {
  const s = await Sweet.findByIdAndUpdate(id, payload, { new: true });
  if (!s) throw new Error("Sweet not found");
  return s;
};

export const deleteSweet = async (id: string) => {
  const existingOrder = await Order.findOne({ sweetId: id });
  if (existingOrder) throw new Error("Cannot delete sweet with existing orders");
  await Sweet.findByIdAndDelete(id);
  return { success: true };
};

export const reduceSweetStock = async (id: string, quantity: number) => {
  if (!quantity || quantity <= 0) quantity = 1;

  const s = await Sweet.findOneAndUpdate(
    { _id: id, quantity: { $gte: quantity } },
    { $inc: { quantity: -quantity } },
    { new: true }
  );
  if (!s) throw new Error("Insufficient stock");
  return s;
};

export const restockSweet = async (id: string, quantity: number) => {
  if (!quantity || quantity <= 0) throw new Error("Invalid restock quantity");
  const s = await Sweet.findByIdAndUpdate(id, { $inc: { quantity } }, { new: true });
  if (!s) throw new Error("Sweet not found");
  return s;
};

export const createOrder = async (userId: string, sweetId: string, quantity: number) => {
  const order = new Order({ userId, sweetId, quantity });
  await order.save();
  return order;
};

// 🔥 FIXED: user order history
export const getUserOrders = async (userId: string) => {
  const orders = await Order.find({ userId })
    .populate({ path: "sweetId", model: "Sweet" })
    .lean();

  return orders.map(o => ({
    ...o,
    sweet: o.sweetId,   // convert sweetId → sweet
    id: o._id,
  }));
};

// 🔥 FIXED: admin order history
export const getAllOrders = async () => {
  const orders = await Order.find()
    .populate({ path: "sweetId", model: "Sweet" })
    .populate({ path: "userId", model: "User" })
    .lean();

  return orders.map(o => ({
    ...o,
    sweet: o.sweetId,
    user: o.userId,
    id: o._id,
  }));
};
