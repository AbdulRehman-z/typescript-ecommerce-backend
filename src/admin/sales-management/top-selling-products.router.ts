import express, { Request, Response, NextFunction } from "express";
import { Product } from "../../models/Product";
import {
  currentUserMiddleware,
  requireAuthMiddleware,
  BadRequestError,
  NotAuthorizedError,
} from "../../common/src";

const router = express.Router();

router.get(
  "/api/admin/orders/top-selling-products/:days",
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

      const products = await Product.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            totalSales: { $gte: 1 },
          },
        },
        {
          $group: {
            _id: "$title",
            totalSaled: { $sum: "$totalSales" },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id",
            totalSaled: 1,
          },
        },
        {
          $sort: {
            totalSaled: -1,
          },
        },
        {
          $limit: 10,
        },
      ]);

      res.status(200).send(products);
    } catch (error) {
      next(error);
    }
  }
);

export { router as topSellingProductsRouter };
