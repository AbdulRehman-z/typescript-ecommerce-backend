import express, { NextFunction, Request, Response } from "express";
import { Product } from "../../models/Product";

const router = express.Router();

interface Product {
  _id: string;
  title: string;
  img: string;
  price: string;
}

interface Data {
  newestArrivals: Array<Product>;
  featuredProducts: Array<Product>;
  categories: any[];
  flashSale: Array<Product>;
}

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data = {} as Data;

    // get all categories
    const categories = await Product.distinct("category");
    data.categories = categories;

    // get newest arrivals
    const newestArrivals = await Product.aggregate([
      {
        $project: {
          title: 1,
          img: 1,
          price: 1,
          createdAt: 1,
        },
      },
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Filter for the last 7 days
          },
        },
      },
      {
        $limit: 10,
      },
    ]);
    data.newestArrivals = newestArrivals;

    // get featured products by average rating
    const featuredProducts = await Product.aggregate([
      {
        $project: {
          title: 1,
          img: 1,
          price: 1,
          ratings: {
            $avg: "$ratings",
          },
        },
      },
      {
        $sort: {
          ratings: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);
    data.featuredProducts = featuredProducts;

    // get flash sale products
    const flashSale = await Product.aggregate([
      {
        $project: {
          title: 1,
          img: 1,
          price: 1,
          flashSale: 1,
        },
      },
      {
        $sort: {
          "flashSale.discount": -1,
        },
      },
      {
        $limit: 10,
      },
    ]);
    data.flashSale = flashSale;

    // aggregation query to return all categories, newest-arriavals and featured products

    // const products = await Product.aggregate([
    //   // Filter documents for new arrivals (e.g., within the last 7 days)
    //   {
    //     $match: {
    //       createdAt: {
    //         $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Filter for the last 7 days
    //       },
    //     },
    //   },
    //   // Group documents by category and count the number of products in each category
    //   {
    //     $group: {
    //       _id: "$category",
    //       count: { $sum: 1 },
    //     },
    //   },
    //   // Sort documents by category count in descending order
    //   {
    //     $sort: {
    //       count: -1,
    //     },
    //   },
    //   // Limit the result to 10 documents
    //   {
    //     $limit: 10,
    //   },
    //   // Lookup the featured products in each category
    //   {
    //     $lookup: {
    //       from: "products",
    //       let: { category: "$_id" },
    //       pipeline: [
    //         // Filter documents for the specific category and featured products
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [
    //                 { $eq: ["$category", "$$category"] },
    //                 { $eq: ["$featured", true] },
    //               ],
    //             },
    //           },
    //         },
    //         // Limit the result to 10 documents
    //         {
    //           $limit: 10,
    //         },
    //       ],
    //       as: "featuredProducts",
    //     },
    //   },
    // ]);

    console.log(data);

    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

export { router as getProductsRouter };
