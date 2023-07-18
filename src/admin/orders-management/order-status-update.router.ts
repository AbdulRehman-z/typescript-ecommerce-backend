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
import { sendOrderConfirmationEmail } from "../../services/email.service";

const router = express.Router();

router.put(
  "/api/admin/orders/status",
  currentUserMiddleware,
  requireAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, status } = req.body;

      // use a small function like findbyidandupdate
      const order = await Order.findById(orderId);

      if (!order) {
        throw new NotFoundError("Order not found");
      }

      // if order status is processing
      if (status === OrderStatus.Processing) {
        const cart = await Cart.findById(order.cartId);
        if (!cart) {
          throw new NotFoundError("Cart not found");
        }

        if (cart.expired !== true) {
          order.set({
            status,
          });

          Promise.all([
            await expirationQueue.removeJobs(cart.jobId!),

            await order.save(),
            await sendOrderConfirmationEmail(
              req.currentUser!.email,
              req.currentUser!.address,
              order
            ),
          ]);
        } else {
          order.set({
            status,
          });
          Promise.all([
            await order.save(),
            await sendOrderConfirmationEmail(
              req.currentUser!.email,
              req.currentUser!.address,
              order
            ),
          ]);
        }
      }

      // if order status is shipped
      if (status === OrderStatus.Shipped) {
        const cart = await Cart.findById(order.cartId);
        if (!cart) {
          throw new NotFoundError("Cart not found");
        }

        // update the inStock and totalSales fields of the products in the order
        const products = cart.products;

        await Promise.all(
          products.map(async (product) => {
            const productInDb = await Product.findById(product.productId);
            if (!productInDb) {
              throw new NotFoundError("Product not found");
            }

            productInDb.set({
              inStock: productInDb.inStock! - product.quantity,
              totalSales: productInDb.totalSales! + product.quantity,
            });

            await productInDb.save();
          })
        );

        if (cart.expired !== true) {
          order.set({
            status,
          });

          Promise.all([
            await expirationQueue.removeJobs(cart.jobId!),
            await order.save(),
            await sendOrderConfirmationEmail(
              req.currentUser!.email,
              req.currentUser!.address,
              order
            ),
          ]);
        } else {
          order.set({
            status,
          });

          Promise.all([
            await order.save(),
            await sendOrderConfirmationEmail(
              req.currentUser!.email,
              req.currentUser!.address,
              order
            ),
          ]);
        }
      }

      // if order status is delivered
      if (status === OrderStatus.Delivered) {
        const cart = await Cart.findById(order.cartId);
        if (!cart) {
          throw new NotFoundError("Cart not found");
        }

        if (cart.expired !== true) {
          order.set({
            status,
          });

          Promise.all([
            await expirationQueue.removeJobs(cart.jobId!),
            await order.save(),
            await sendOrderConfirmationEmail(
              req.currentUser!.email,
              req.currentUser!.address,
              order
            ),
          ]);
        } else {
          order.set({
            status,
          });

          Promise.all([
            await order.save(),
            await sendOrderConfirmationEmail(
              req.currentUser!.email,
              req.currentUser!.address,
              order
            ),
          ]);
        }
      }

      //if order order status is cancelled
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
              cancelled: true,
              canceledRequested: false,
              avaliableQuantity:
                productInDb.avaliableQuantity! + product.quantity,
              inStock: productInDb.inStock + product.quantity,
              totalSales: productInDb.totalSales! - product.quantity,
            });
            await productInDb.save();
          })
        );

        // remove the cart from the expiration queue
        if (cart.expired !== true) {
          order.set({
            status,
          });

          Promise.all([
            await expirationQueue.removeJobs(cart.jobId!),
            await order.save(),
            await sendOrderConfirmationEmail(
              req.currentUser!.email,
              req.currentUser!.address,
              order
            ),
          ]);
        } else {
          order.set({
            status,
          });
          Promise.all([
            await order.save(),
            await sendOrderConfirmationEmail(
              req.currentUser!.email,
              req.currentUser!.address,
              order
            ),
          ]);
        }
      }

      // if order status is refunded
      if (status === OrderStatus.Refunded) {
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
              refundRequested: false,
              refunded: true,
              avaliableQuantity:
                productInDb.avaliableQuantity! + product.quantity,
              inStock: productInDb.inStock + product.quantity,
              totalSales: productInDb.totalSales! - product.quantity,
            });

            await productInDb.save();
          })
        );

        // remove the cart from the expiration queue
        if (cart.expired !== true) {
          order.set({
            status,
          });

          Promise.all([
            await expirationQueue.removeJobs(cart.jobId!),
            await order.save(),
            await sendOrderConfirmationEmail(
              req.currentUser!.email,
              req.currentUser!.address,
              order
            ),
          ]);
        } else {
          order.set({
            status,
          });
          Promise.all([
            await order.save(),
            await sendOrderConfirmationEmail(
              req.currentUser!.email,
              req.currentUser!.address,
              order
            ),
          ]);
        }
      }

      res.status(200).send(order);
    } catch (error) {}
  }
);

export { router as updateOrderStatusRouter };
