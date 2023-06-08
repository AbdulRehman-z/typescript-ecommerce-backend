import express, { NextFunction, Request, Response } from "express";
import { Product } from "../../models/Product";

const router = express.Router();

interface Query {
  available: boolean;
  title: string;
  image: string;
  description: string;
  category: string;
  sizes: Array<string>;
  gender: string;
  color: Array<string>;
  price: number;
  stock: number;
  flashSale: {
    active: boolean;
    discount: number;
    startDate: Date;
    endDate: Date;
  };
}

// update product
router.put(
  "/api/products/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        available,
        title,
        image,
        description,
        category,
        sizes,
        gender,
        color,
        price,
        stock,
        flashSale,
      } = req.body;

      let query: Partial<Query> = {};

      // check statements for what to update for a product

      if (req.query.available) {
        query.available = available;
      }
      if (title) {
        query.title = title;
      }
      if (image) {
        query.image = image;
      }
      if (description) {
        query.description = description;
      }
      if (category) {
        query.category = category;
      }
      if (sizes) {
        query.sizes = sizes;
      }
      if (gender) {
        query.gender = gender;
      }
      if (color) {
        query.color = color;
      }
      if (price) {
        query.price = price;
      }
      if (stock) {
        query.stock = stock;
      }
      if (flashSale) {
        query.flashSale = flashSale;
      }

      console.log(query);

      // update product
      const product = await Product.findByIdAndUpdate(req.params.id, query, {
        new: true,
      });

      res.status(200).send(product);
    } catch (error) {
      next(error);
    }
  }
);

export { router as updateProductRouter };
