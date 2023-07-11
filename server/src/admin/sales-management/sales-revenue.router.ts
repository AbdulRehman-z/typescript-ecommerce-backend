import express, { Request, Response, NextFunction } from "express";
import { Order, OrderStatus } from "../../models/Order";
import {
  NotAuthorizedError,
  currentUserMiddleware,
  requireAuthMiddleware,
  BadRequestError,
} from "../../common/src";

const router = express.Router();

// router for total sales revenue by month, year, and day, and by week
router.get(
  "/api/admin/orders/sales-revenue",
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

      const startDate = req.query.startDate?.toString();
      const endDate = req.query.endDate?.toString();

      // Check if the startDate and endDate are valid
      if (!startDate || !endDate) {
        throw new BadRequestError("Please provide a valid date range");
      }

      // Aggregate pipeline for total sales revenue by the specified time period
      const result = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(startDate!),
              $lte: new Date(endDate!),
            },
            status: OrderStatus.Delivered, // Filter by completed orders
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalPrice" },
          },
        },
        {
          $project: {
            _id: 0,
            totalRevenue: 1,
          },
        },
      ]);

      if (result.length > 0) {
        const totalRevenue = result[0].totalRevenue;
        res.status(200).json({ totalRevenue });
      } else {
        res.status(200).json({ totalRevenue: 0 });
      }
    } catch (error) {
      next(error);
    }
  }
);
