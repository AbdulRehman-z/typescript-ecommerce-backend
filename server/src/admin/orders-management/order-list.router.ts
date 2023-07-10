import express, { Request, Response, NextFunction } from "express";
import {
  NotAuthorizedError,
  currentUserMiddleware,
  requireAuthMiddleware,
} from "../../common/src";
import { Order } from "../../models/Order";

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

      const orders = await Order.find({}).limit(10).sort({ createdAt: -1 });

      res.status(200).send(orders);
    } catch (error) {
      next(error);
    }
  }
);
