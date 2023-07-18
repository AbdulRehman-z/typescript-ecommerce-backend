import express, { Request, Response, NextFunction } from "express";
import { Order } from "../../models/Order";
import {
  currentUserMiddleware,
  requireAuthMiddleware,
  NotFoundError,
  NotAuthorizedError,
} from "../../common/src";

const router = express.Router();

router.get(
  "/api/admin/orders/:orderId",
  currentUserMiddleware,
  requireAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // check if the user is admin
      if (req.currentUser!.isAdmin !== true) {
        throw new NotAuthorizedError(
          "You are not authorized to access this route"
        );
      }

      const { orderId } = req.params;

      const order = await Order.findById(orderId);

      if (!order) {
        throw new NotFoundError("Order not found");
      }

      res.status(200).send(order);
    } catch (error) {
      next(error);
    }
  }
);

export { router as getOrderRouter };
