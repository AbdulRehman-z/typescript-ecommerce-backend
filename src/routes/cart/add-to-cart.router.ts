import exprees, { NextFunction, Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  currentUserMiddleware,
  requireAuthMiddleware,
} from "../../common/src";
import { Product } from "../../models/Product";

const router = exprees.Router();

router.post(
  "/api/cart/add-to-cart",
  currentUserMiddleware,
  requireAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId, quantity } = req.body;

      // Find the product with the provided id
      const product = await Product.findById(productId);
      console.log("product: ", product);

      // If no product found, throw an error
      if (!product) {
        throw new NotFoundError("Product not found");
      }

      // If product is not available, throw an error
      if (!product.available) {
        throw new NotFoundError("Product is out of stock");
      }

      // If product is available but the quantity is greater than the avaliableQuantity quantity, throw an error
      if (quantity > product.avaliableQuantity && product.available) {
        throw new BadRequestError("Requested quantity is not available");
      }

      // If product is available and the quantity is less than the avaliable quantity, update the product
      if (quantity <= product.avaliableQuantity && product.available) {
        product.set({
          reservedQuantity: product.reservedQuantity + quantity,
          avaliableQuantity: product.avaliableQuantity - quantity,
        });
        await product.save();
      }
      console.log("product: ", product);

      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }
);

export { router as addToCartRouter };
