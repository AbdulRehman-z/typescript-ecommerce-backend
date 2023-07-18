import express, { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  NotFoundError,
  currentUserMiddleware,
  requireAuthMiddleware,
} from "../../common/src";
import { Order } from "../../models/Order";

const router = express.Router();

router.post(
  "/api/orders",
  currentUserMiddleware,
  requireAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = req.query.orderId;
      const action = req.query.action;

      console.log("orderId", orderId);
      console.log("action", action);

      // send refund request to admin
      if (action === "refund") {
        const order = await Order.findById(orderId);
        if (!order) {
          throw new NotFoundError("Order not found");
        }

        if (order.status !== "delivered") {
          throw new BadRequestError("Order is not delivered yet");
        }

        order.set({ refundRequested: true });
        await order.save();
        return res
          .status(200)
          .send({
            message:
              "Your refund request has been sent. Please wait for the admin to approve it",
          });
      }

      // send cancel request to admin

      if (action === "cancel") {
        const order = await Order.findById(orderId);
        if (!order) {
          throw new NotFoundError("Order not found");
        }

        // if order is shipped
        if (order.status === "shipped") {
          throw new BadRequestError(
            "Can't cancel order now! Order is shipped. Please request refund"
          );
        }

        // if order is delivered
        if (order.status === "delivered") {
          throw new BadRequestError(
            "Can't cancel order now! Order is delivered. Please request refund"
          );
        }
        order.set({ cancelRequested: true });
        await order.save();
        return res.status(200).send({
          message:
            "Your cancel request has been sent. Please wait for the admin to approve it",
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

export { router as orderActionsRouter };
