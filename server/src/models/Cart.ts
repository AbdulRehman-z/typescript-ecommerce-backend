import mongoose from "mongoose";

export interface CartAttrs {
  userId: string;
  products: [
    {
      productId: string;
      quantity: number;
    }
  ];
}

interface CartDoc extends mongoose.Document {
  jobId?: string;
  expired: boolean;
  userId: string;
  orderId?: string;
  products: [
    {
      productId: string;
      quantity: number;
    }
  ];
}

interface CartModel extends mongoose.Model<CartDoc> {
  build(attrs: CartAttrs): CartDoc;
}

const CartSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      default: null,
    },
    expired: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    orderId: {
      type: String,
    },
    products: [
      {
        productId: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
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

CartSchema.statics.build = (attrs: CartAttrs) => {
  return new Cart(attrs);
};

const Cart = mongoose.model<CartDoc, CartModel>("Cart", CartSchema);

export { Cart };
