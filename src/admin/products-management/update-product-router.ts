import express, { NextFunction, Request, Response } from "express";
import { Product } from "../../models/Product";

const router = express.Router();

interface Query {
  available?: boolean;
  title?: string;
  image?: string;
  description?: string;
  category?: string;
  sizes?: Array<string>;
  gender?: string;
  color?: Array<string>;
  price?: number;
  stock?: number;
  flashSale?: {
    active?: boolean;
    discount?: number;
    startDate?: Date;
    endDate?: Date;
  };
}

// update product
router.put(
  "/api/products/update/:id",
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

      let query: Query = {};

      // check statements for what to update for a product

      if (available !== undefined) {
        query.available = available;
      }
      if (title !== undefined) {
        query.title = title;
      }
      if (image !== undefined) {
        query.image = image;
      }
      if (description !== undefined) {
        query.description = description;
      }
      if (category !== undefined) {
        query.category = category;
      }
      if (sizes !== undefined) {
        query.sizes = sizes;
      }
      if (gender !== undefined) {
        query.gender = gender;
      }
      if (color !== undefined) {
        query.color = color;
      }
      if (price !== undefined) {
        query.price = price;
      }
      if (stock !== undefined) {
        query.stock = stock;
      }
      if (flashSale !== undefined) {
        query.flashSale = flashSale;
      }

      console.log(query);

      // update product
      const product = await Product.findByIdAndUpdate(req.params.id, query);

      res.status(200).send(product);
    } catch (error) {
      next(error);
    }
  }
);

export { router as updateProductRouter };
