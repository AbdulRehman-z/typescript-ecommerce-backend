import express, { NextFunction, Request, Response } from "express";
import { Product } from "../../models/Product";

const router = express.Router();

router.get(
  "/api/products/:category",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await Product.find({
        categories: req.params.category,
      }).limit(10);

      // const products = await Product.find({}).limit(10);
      res.status(200).send(products);
    } catch (error) {
      next(error);
    }
  }
);

export { router as getProductsByCategoryRouter };
