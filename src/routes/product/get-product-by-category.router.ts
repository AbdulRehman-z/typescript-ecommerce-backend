import express, { NextFunction, Request, Response } from "express";
import { Product } from "../../models/Product";

interface Query {
  category?: string;
  price?:
    | { $lt: number }
    | { $gt: number }
    | { $lte: number }
    | { $gte: number };
  priceOperator?:
    | { $lt: number }
    | { $gt: number }
    | { $lte: number }
    | { $gte: number };
  size?: string;
}

const router = express.Router();

router.get(
  "/api/products",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let query: Query = {};

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
        const gender = String(req.query.gender);
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

      console.log(query);

      const products = await Product.find(query);
      //   console.log(performance.now());
      //   const products = await Product.find({
      //     color: req.params.category,
      //   });
      //   console.log(performance.now());

      //   console.log(products.length);

      res.status(200).send(products);
    } catch (error) {
      next(error);
    }
  }
);

export { router as getProductsByCategoryRouter };
