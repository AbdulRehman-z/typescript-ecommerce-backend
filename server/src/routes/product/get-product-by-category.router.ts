import express, { NextFunction, Request, Response } from "express";
import { Product } from "../../models/Product";

interface Query {
  category: string;
  price:
    | { $lt: number }
    | { $gt: number }
    | { $lte: number }
    | { $gte: number };
  priceOperator:
    | { $lt: number }
    | { $gt: number }
    | { $lte: number }
    | { $gte: number };
  size: string;
  gender: string;
}

const router = express.Router();

router.get(
  "/api/products",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let query: Partial<Query> = {};

      /*
      HANDLE FILTERING QUERIES
      **/

      // Handle size filtering queries
      if (req.query.size) {
        const size = req.query.size;
        query.size = String(size);
      }

      // Handle gender filtering queries
      if (req.query.gender) {
        const gender = req.query.gender;
        query.gender = String(gender);
      }

      // Handle category filtering queries
      if (req.query.category) {
        const category = req.query.category;
        query.category = String(category);
      }

      // Handle price filtering queries
      if (req.query.price && req.query.priceOperator) {
        const price = Number(req.query.price);
        const priceOperator = req.query.priceOperator;

        switch (priceOperator) {
          case "lt":
            query.price = { $lt: price };
            break;
          case "gt":
            query.price = { $gt: price };
            break;
          case "lte":
            query.price = { $lte: price };
            break;
          case "gte":
            query.price = { $gte: price };
            break;
          default:
            // Invalid price operator provided
            return res.status(400).json({ message: "Invalid price operator" });
        }
      }

      const products = await Product.find(query, {
        description: 1,
        price: 1,
        title: 1,
        __id: 1,
        category: 1,
        sizes: 1,
        color: 1,
      });

      res.status(200).send(products);
    } catch (error) {
      next(error);
    }
  }
);

export { router as getProductsByCategoryRouter };
