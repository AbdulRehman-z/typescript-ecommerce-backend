import express, { Request, Response, NextFunction } from "express";
import { Order } from "../../models/Order";
import {
  currentUserMiddleware,
  requireAuthMiddleware,
  NotAuthorizedError,
  NotFoundError,
} from "../../common/src";

const router = express.Router();

const ACTIONS = [
  "refundRequested",
  "cancelRequested",
  "delivered",
  "shipped",
  "processing",
  "cancelled",
  "refunded",
];

router.get(
  "/api/admin/orders",
  currentUserMiddleware,
  requireAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.currentUser!.isAdmin !== true) {
        throw new NotAuthorizedError(
          "You are not authorized to access this route"
        );
      }

      const action = req.query.action;

      // check if action is valid
      if (!ACTIONS.includes(action as string)) {
        throw new NotFoundError("Please provide a valid action");
      }

      // if action is not provided, return all orders with limit 10
      if (!action) {
        const orders = await Order.find({}).limit(10).sort({ createdAt: -1 });

        if (!orders) {
          throw new NotFoundError("No orders found");
        }
        res.status(200).send(orders);
      }

      if (action === "refundRequested") {
        const orders = await Order.find({ refundRequested: true })
          .limit(10)
          .sort({ createdAt: -1 });

        if (!orders) {
          throw new NotFoundError("No orders found for refund");
        }

        res.status(200).send(orders);
      }

      if (action === "cancelRequested") {
        const orders = await Order.find({ cancelRequested: true })
          .limit(10)
          .sort({ createdAt: -1 });

        if (!orders) {
          throw new NotFoundError("No orders found for cancelation");
        }

        res.status(200).send(orders);
      }

      if (action === "delivered") {
        const orders = await Order.find({ status: "delivered" })
          .limit(10)
          .sort({ createdAt: -1 });

        if (!orders) {
          throw new NotFoundError("No delivered orders found");
        }

        res.status(200).send(orders);
      }

      if (action === "shipped") {
        const orders = await Order.find({ status: "shipped" })
          .limit(10)
          .sort({ createdAt: -1 });

        if (!orders) {
          throw new NotFoundError("No shipped orders found");
        }

        res.status(200).send(orders);
      }

      if (action === "processing") {
        const orders = await Order.find({ status: "processing" })
          .limit(10)
          .sort({ createdAt: -1 });

        if (!orders) {
          throw new NotFoundError("No processing orders found");
        }

        res.status(200).send(orders);
      }

      if (action === "cancelled") {
        const orders = await Order.find({ status: "cancelled" })
          .limit(10)
          .sort({ createdAt: -1 });

        if (!orders) {
          throw new NotFoundError("No cancelled orders found");
        }

        res.status(200).send(orders);
      }

      if (action === "refunded") {
        const orders = await Order.find({ status: "refunded" })
          .limit(10)
          .sort({ createdAt: -1 });

        if (!orders) {
          throw new NotFoundError("No refunded orders found");
        }

        res.status(200).send(orders);
      }
    } catch (error) {
      next(error);
    }
  }
);

export { router as getSpecificOrdersRouter };
