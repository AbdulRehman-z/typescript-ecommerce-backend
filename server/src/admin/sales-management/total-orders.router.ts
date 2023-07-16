import express, { Request, Response, NextFunction } from "express";
import { Order, OrderStatus } from "../../models/Order";
import {
  currentUserMiddleware,
  requireAuthMiddleware,
  NotAuthorizedError,
  BadRequestError,
} from "../../common/src";

const router = express.Router();

router.get(
  "/api/admin/orders/total-orders/:days",
  currentUserMiddleware,
  requireAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if the user is admin
      if (req.currentUser!.isAdmin !== true) {
        throw new NotAuthorizedError(
          "You are not authorized to access this route"
        );
      }

      const { days } = req.params;

      if (!days || parseInt(days, 10) < 0 || isNaN(parseInt(days, 10))) {
        throw new BadRequestError("Please provide a valid date range");
      }

      // Calculate the start date based on the specified number of days
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days, 10));

      // Aggregate pipeline for total orders by specified time period
      const result = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            status: OrderStatus.Delivered, // Filter by completed orders
          },
        },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            totalOrders: 1,
          },
        },
      ]);

      const totalOrders = result.length > 0 ? result[0].totalOrders : 0;

      res.status(200).json({ totalOrders });
    } catch (error) {
      next(error);
    }
  }
);

export { router as totalOrdersRouter };
