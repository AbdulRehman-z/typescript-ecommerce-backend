import express, { NextFunction, Request, Response } from "express";
import { Product } from "../../models/Product";

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // aggregation query to return all categories, newest-arriavals and featured products
    const products = await Product.aggregate([
      // Filter documents for new arrivals (e.g., within the last 7 days)
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Filter for the last 7 days
          },
        },
      },
      // Group documents by category and count the number of products in each category
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      // Sort documents by category count in descending order
      {
        $sort: {
          count: -1,
        },
      },
      // Limit the result to 10 documents
      {
        $limit: 10,
      },
      // Lookup the featured products in each category
      {
        $lookup: {
          from: "products",
          let: { category: "$_id" },
          pipeline: [
            // Filter documents for the specific category and featured products
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$category", "$$category"] },
                    { $eq: ["$featured", true] },
                  ],
                },
              },
            },
            // Limit the result to 10 documents
            {
              $limit: 10,
            },
          ],
          as: "featuredProducts",
        },
      },
    ]);

    console.log(products);

    res.status(200).send(products);
  } catch (error) {
    next(error);
  }
});

export { router as getProductsRouter };
