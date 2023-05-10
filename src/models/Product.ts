import mongoose from "mongoose";

interface ProductAttrs {
  title: string;
  img: string;
  desc: string;
  categories: Array<null>;
  size: string;
  color: string;
  price: string;
}

interface ProductDoc extends mongoose.Document {
  title: string;
  img: string;
  desc: string;
  categories: Array<null>;
  size: string;
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
    desc: { type: String, required: true },
    categories: { type: Array },
    size: { type: String },
    color: { type: String },
    price: { type: String, required: true },
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

const Product = mongoose.model<ProductDoc, ProductModel>(
  "Product",
  ProductSchema
);
