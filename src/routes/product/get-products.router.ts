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
          rating: {
            $avg: "$rating",
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

    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

export { router as getProductsRouter };
