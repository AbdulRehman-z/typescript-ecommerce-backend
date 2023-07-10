import express, { Request, Response, NextFunction } from "express";
import { Product } from "../../models/Product";
import { Order, OrderStatus } from "../../models/Order";
import {
  currentUserMiddleware,
  NotFoundError,
  requireAuthMiddleware,
} from "../../common/src";
import { Cart } from "../../models/Cart";
import { expirationQueue } from "../../services/expiration-queue.service";

const router = express.Router();

router.post(
  "/api/admin/orders/status",
  currentUserMiddleware,
  requireAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, status } = req.body;

      // use a small function like findbyidandupdate
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          status,
        },
        { new: true }
      );

      if (!order) {
        throw new NotFoundError("Order not found");
      }

      if (status === OrderStatus.Cancelled) {
        const cart = await Cart.findById(order.cartId);
        if (!cart) {
          throw new NotFoundError("Cart not found");
        }
        const products = cart.products;

        await Promise.all(
          products.map(async (product) => {
            const productInDb = await Product.findById(product.productId);
            if (!productInDb) {
              throw new NotFoundError("Product not found");
            }
            productInDb.set({
              reservedQuantity:
                productInDb.reservedQuantity! - product.quantity,
              inStock: productInDb.inStock + product.quantity,
            });
            await productInDb.save();
          })
        );

        // remove the cart from the expiration queue
        if (cart.expired !== true) {
          Promise.all([
            await expirationQueue.removeJobs(cart.jobId!),
            await cart.remove(),
          ]);
        } else {
          await cart.remove();
        }
      }

      /////////////////////////////////

      /////////////////////////////////

      res.status(200).send(order);
    } catch (error) {}
  }
);
