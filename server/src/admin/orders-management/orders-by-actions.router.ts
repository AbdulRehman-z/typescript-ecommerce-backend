import express, { Request, Response, NextFunction } from "express";
import { Order } from "../../models/Order";
import {
  currentUserMiddleware,
  requireAuthMiddleware,
  NotAuthorizedError,
  NotFoundError,
} from "../../common/src";

const router = express.Router();

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

      if (action === "refund") {
        const orders = await Order.find({ refundRequested: true })
          .limit(10)
          .sort({ createdAt: -1 });

        if (!orders) {
          throw new NotFoundError("No orders found for refund");
        }

        res.status(200).send(orders);
      }

      if (action === "cancel") {
        const orders = await Order.find({ cancelRequested: true })
          .limit(10)
          .sort({ createdAt: -1 });

        if (!orders) {
          throw new NotFoundError("No orders found for cancel");
        }

        res.status(200).send(orders);
      }
    } catch (error) {
      next(error);
    }
  }
);
