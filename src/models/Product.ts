import mongoose from "mongoose";

interface ProductAttrs {
  title: string;
  img: string;
  description: string;
  category: string;
  sizes: Array<string>;
  gender: string;
  color: string;
  price: string;
}

interface ProductDoc extends mongoose.Document {
  title: string;
  img: string;
  description: string;
  category: string;
  sizes: Array<string>;
  gender: string;
  color: string;
  price: string;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    img: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, index: true },
    sizes: {
      type: Array,
      index: true,
    },
    gender: { type: String },
    color: { type: String },
    price: { type: String, required: true, index: true },
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
