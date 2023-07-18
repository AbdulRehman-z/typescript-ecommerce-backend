import express, { NextFunction, Request, Response } from "express";
import {
  NotFoundError,
  currentUserMiddleware,
  requireAuthMiddleware,
} from "../../common/src";
import { Cart } from "../../models/Cart";

const router = express.Router();

router.delete(
  "/api/cart/remove-item",
  currentUserMiddleware,
  requireAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.body;

      const cart = await Cart.findOne({ userId: req.currentUser!.id });

      if (!cart) {
        throw new NotFoundError("Cart not found");
      }
      const updatedCart = await Cart.findOneAndUpdate(
        { userId: req.currentUser!.id },
        {
          $pull: { products: { productId: productId } },
        },
        { new: true }
      );
      updatedCart?.save();
      res.status(200).json(updatedCart);
    } catch (error) {
      next(error);
    }
  }
);

export { router as deleteCartItemRouter };
