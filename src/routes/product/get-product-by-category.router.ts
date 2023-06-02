import express, { NextFunction, Request, Response } from "express";
import { Product } from "../../models/Product";

const router = express.Router();

router.get(
  "/api/products/:category",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.params.category);
      const products = await Product.find({
        color: req.params.category,
      });

      res.status(200).send(products);
    } catch (error) {
      next(error);
    }
  }
);

export { router as getProductsByCategoryRouter };
