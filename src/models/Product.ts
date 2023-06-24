import mongoose from "mongoose";

interface FlashSale {
  active: boolean;
  discount: number;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

interface ProductAttrs {
  available?: boolean;
  title: string;
  img: string;
  description: string;
  category: string;
  sizes: Array<string>;
  gender: string;
  inStock: number;
  color: Array<string>;
  price: string;
  avaliableQuantity: number;
  flashSale: FlashSale;
  reservedQuantity?: number;
  rating?: Array<number>;
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
  inStock: number;
  price: string;
  avaliableQuantity: number;
  flashSale: FlashSale;
  reservedQuantity?: number;
  rating: Array<number>;
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
    avaliableQuantity: { type: Number, required: true },
    flashSale: {
      active: { type: Boolean, default: false },
      discount: { type: Number, default: 0 },
      startDate: { type: Date, default: undefined },
      endDate: { type: Date, default: undefined },
    },
    reservedQuantity: { type: Number, default: 0 },
    rating: {
      type: Array,
      default: [],
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

ProductSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs);
};

console.log(ProductSchema.indexes());

const Product = mongoose.model<ProductDoc, ProductModel>(
  "Product",
  ProductSchema
);

export { Product };
