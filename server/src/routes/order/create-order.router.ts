import express, { NextFunction, Request, Response } from "express";
import { Order, OrderStatus } from "../../models/Order";
import { Product } from "../../models/Product";
import { User } from "../../models/User";
import {
  currentUserMiddleware,
  NotFoundError,
  requireAuthMiddleware,
} from "../../common/src";
import { Cart } from "../../models/Cart";

const router = express.Router();

router.post(
  "/api/order/create-order",
  currentUserMiddleware,
  requireAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cartId, totalPrice } = req.body;

      // build the order
      const order = Order.build({
        userId: req.currentUser!.id,
        cartId,
        address: req.currentUser!.address,
        totalPrice,
        status: OrderStatus.Pending,
      });

      // save the order in user's order array
      const updatedUser = await User.findByIdAndUpdate(
        { _id: req.currentUser!.id },
        { $push: { orders: order }, $pull: { cart: cartId } },
        { new: true }
      );

      // update the products in the cart to be sold
      const cart = await Cart.findById(cartId);

      if (!cart) {
        throw new NotFoundError("Cart not found");
      }

      const products = cart.products;
      // update the reserved quantity of the products
      await Promise.all(
        products.map(async (product) => {
          const productToUpdate = await Product.findById(product.productId);

          if (!productToUpdate) {
            throw new NotFoundError("Product not found");
          }

          productToUpdate.set({
            reservedQuantity:
              productToUpdate.reservedQuantity! - product.quantity,
            inStock: productToUpdate.inStock! - product.quantity,
          });

          await productToUpdate.save();
        })
      );

      // save the order in the db
      await Promise.all([order.save(), updatedUser?.save()]);

      res.status(201).send(order);
    } catch (error) {
      next(error);
    }
  }
);

export { router as createOrderRouter };
