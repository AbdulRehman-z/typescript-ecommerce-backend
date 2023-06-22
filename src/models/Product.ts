import mongoose from "mongoose";

interface FlashSale {
  active: boolean;
  discount: number;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

interface ProductAttrs {
  available: boolean;
  title: string;
  img: string;
  description: string;
  category: string;
  sizes: Array<string>;
  gender: string;
  color: Array<string>;
  price: string;
  AvaliableQuantity: number;
  flashSale: FlashSale;
  reservedQuantity?: number;
  ratings: Array<number>;
}

interface ProductDoc extends mongoose.Document {
  available: boolean;
  title: string;
  img: string;
  description: string;
  category: string;
  sizes: Array<string>;
  gender: string;
  color: Array<string>;
  price: string;
  AvaliableQuantity: number;
  flashSale: FlashSale;
  reservedQuantity?: number;
  ratings: Array<number>;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

const ProductSchema = new mongoose.Schema(
  {
    available: { type: Boolean, default: true },
    title: { type: String, required: true },
    img: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, index: true },
    sizes: {
      type: Array,
      index: true,
    },
    gender: { type: String },
    color: { type: Array },
    price: { type: String, required: true, index: true },
    inStock: { type: Number, default: 1 },
    AvaliableQuantity: { type: Number, required: true },
    flashSale: {
      active: { type: Boolean, default: false },
      discount: { type: Number, default: 0 },
      startDate: { type: Date, default: undefined },
      endDate: { type: Date, default: undefined },
    },
    reservedQuantity: { type: Number, default: 0 },
    ratings: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

ProductSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs);
};

console.log(ProductSchema.indexes());

const Product = mongoose.model<ProductDoc, ProductModel>(
  "Product",
  ProductSchema
);

export { Product };
