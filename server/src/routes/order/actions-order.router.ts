import express, { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  NotFoundError,
  currentUserMiddleware,
  requireAuthMiddleware,
} from "../../common/src";
import { Cart } from "../../models/Cart";
import { sendOrderConfirmationEmail } from "../../services/email.service";
import { expirationQueue } from "../../services/expiration-queue.service";
import { Product } from "../../models/Product";
import { Order } from "../../models/Order";

const router = express.Router();

router.post(
  "/api/orders",
  currentUserMiddleware,
  requireAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, action } = req.query;
      // send refund request to admin
      if (action === "refund") {
        const order = await Order.findById(orderId);
        if (!order) {
          throw new NotFoundError("Order not found");
        }

        order.set({ refundRequested: true });
        await order.save();
        return res.status(200).send({ message: "Refund requested" });
      }

      // send cancel request to admin

      if (action === "cancel") {
        const order = await Order.findById(orderId);
        if (!order) {
          throw new NotFoundError("Order not found");
        }

        order.set({ cancelRequested: true });
        await order.save();
        return res.status(200).send({ message: "Cancel requested" });
      }
    } catch (error) {
      next(error);
    }
  }
);
