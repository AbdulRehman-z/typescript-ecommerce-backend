import mongoose from "mongoose";
import { OrderAttrs, OrderStatus } from "../types/types";

export interface OrderDoc extends mongoose.Document {
  userId: string;
  cartId: string;
  totalPrice: number;
  refundRequest: boolean;
  refunded: boolean;
  cancelRequested: boolean;
  cancelled: boolean;
  address: Object;
  status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    cartId: {
      type: String,
      required: true,
      index: true,
      default: null,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: Object.values(OrderStatus),
    },
    refundRequested: {
      type: Boolean,
      default: false,
    },
    refunded: {
      type: Boolean,
      default: false,
    },
    cancelRequested: {
      type: Boolean,
      default: false,
    },
    cancelled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(ret) {
        delete ret.__v;
      },
    },
  }
);

OrderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", OrderSchema);

export { Order, OrderStatus };
