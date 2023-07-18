import express, { NextFunction, Request, Response } from "express";
import { Product } from "../../models/Product";

const router = express.Router();

router.get(
  "/api/product/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await Product.findById({ _id: req.params.id });
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }
);

export { router as getProductRouter };
