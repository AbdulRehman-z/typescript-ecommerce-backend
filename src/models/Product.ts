import mongoose from "mongoose";

interface Categories {
  name: string;
}

interface ProductAttrs {
  title: string;
  img: string;
  description: string;
  categories: Categories[];
  size: string;
  color: string;
  price: string;
}

interface ProductDoc extends mongoose.Document {
  title: string;
  img: string;
  description: string;
  categories: Categories[];
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
    description: { type: String, required: true },
    categories: { type: Array },
    size: { type: String },
    color: { type: String, index: true },
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

// set category as index
// ProductSchema.index({ categories: 1 });

// ProductSchema.clearIndexes();
console.log(ProductSchema.indexes());

const Product = mongoose.model<ProductDoc, ProductModel>(
  "Product",
  ProductSchema
);

export { Product };
