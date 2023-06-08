import express, { NextFunction, Request, Response } from "express";
import { Product } from "../../models/Product";

const router = express.Router();

router.get(
  "/api/products/:condition",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let query = {};

      if (req.params.condition === "newest-arrivals") {
      }

      // res.status(200).send(products);
    } catch (error) {
      next(error);
    }
  }
);

export { router as getProductsRouter };
