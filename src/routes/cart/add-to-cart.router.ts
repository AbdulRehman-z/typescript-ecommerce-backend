import exprees, { NextFunction, Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  requireAuthMiddleware,
} from "../../common/src";
import { Product } from "../../models/Product";

const router = exprees.Router();

router.post(
  "/api/cart/add-to-cart",
  requireAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId, quantity } = req.body;

    // Find the product with the provided id
    const product = await Product.findById(productId);

    // If no product found, throw an error
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    // If product is not available, throw an error
    if (!product.available) {
      throw new NotFoundError("Product is out of stock");
    }

    // If product is available but the quantity is less than the requested quantity, throw an error
    if (product.available && product.AvaliableQuantity < quantity) {
      throw new BadRequestError("Requested quantity is not available");
    }

    // If product is available and the quantity is more than the requested quantity, update the product
    if (product.available && product.AvaliableQuantity >= quantity) {
      product.AvaliableQuantity -= quantity;
      product.reservedQuantity += quantity;
      await product.save();
    }

    res.send(200).json(product);
  }
);

export { router as addToCartRouter };
