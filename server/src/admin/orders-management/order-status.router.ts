import express, { Request, Response, NextFunction } from "express";
import { Order, OrderStatus } from "../../models/Order";
import {
  currentUserMiddleware,
  NotFoundError,
  requireAuthMiddleware,
} from "../../common/src";
import { Cart } from "../../models/Cart";

const router = express.Router();

router.post(
  "/api/admin/orders/status",
  currentUserMiddleware,
  requireAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, status } = req.body;

      const order = await Order.findById(orderId);

      if (!order) {
        throw new NotFoundError("Order not found");
      }

      if (status === OrderStatus.Processing) {
        order?.set({
          status,
        });
      }

      if (status === OrderStatus.Shipped) {
        order?.set({
          status,
        });
      }

      if (status === OrderStatus.Delivered) {
        order?.set({
          status,
        });
      }

      await order?.save();

      res.status(200).send(order);
    } catch (error) {}
  }
);
