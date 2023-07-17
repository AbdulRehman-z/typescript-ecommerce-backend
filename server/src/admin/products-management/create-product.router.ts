import express, { NextFunction, Request, Response } from "express";
import {
  BadRequestError,
  NotAuthorizedError,
  currentUserMiddleware,
  requireAuthMiddleware,
  validateRequestMiddleware,
} from "../../common/src";
import { fa, faker } from "@faker-js/faker";
import { body } from "express-validator";
import { Product } from "../../models/Product";

const router = express.Router();

// create product router
router.post(
  "/api/admin/products/create",
  currentUserMiddleware,
  requireAuthMiddleware,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("img").not().isEmpty().withMessage("Image is required"),
    body("description").not().isEmpty().withMessage("Description is required"),
    body("size").not().isEmpty().withMessage("Size is required"),
    body("color").not().isEmpty().withMessage("Color is required"),
    body("categories").not().isEmpty().withMessage("Categories is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequestMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // check if user is admin or not
      if (!req.currentUser?.isAdmin) {
        throw new NotAuthorizedError(
          "You are not authorized to create product"
        );
      }

      // get the product details from the request body
      const {
        title,
        price,
        img,
        description,
        sizes,
        color,
        category,
        avaliableQuantity,
        flashSale,
        gender,
        inStock,
      } = req.body;

      // add 1000 products to the database based on the faker library and the product model

      //  available?: boolean;
      //   title: string;
      //   img: string;
      //   description: string;
      //   category: string;
      //   sizes: Array<string>;
      //   gender: string;
      //   inStock: number;
      //   color: Array<string>;
      //   price: string;
      //   avaliableQuantity: number;
      //   flashSale: FlashSale;
      //   reservedQuantity?: number;
      //   rating?: Array<number>;

      // active: boolean;
      //   discount: number;
      //   startDate: Date | undefined;
      //   endDate: Date | undefined;

      for (let i = 0; i < 1000; i++) {
        // generate random number between 100 and 1000
        const randomNumber = faker.datatype.number({ min: 100, max: 1000 });

        // generate random numbers between 0 and 5 and push it to the rating array
        const ratingArray = [];
        for (let i = 0; i < 5; i++) {
          ratingArray.push(faker.datatype.number({ min: 0, max: 5 }));
        }

        const newProduct = Product.build({
          title: faker.commerce.productName(),
          img: faker.image.url(),
          description: faker.commerce.productDescription(),
          category: faker.commerce.department(),
          sizes: ["S", "M", "L", "XL"],
          gender: faker.person.sex(),
          inStock: randomNumber,
          color: ["red", "blue", "green", "yellow"],
          price: faker.commerce.price(),
          avaliableQuantity: randomNumber,
          flashSale: {
            active: false,
            discount: 0,
            startDate: undefined,
            endDate: undefined,
          },
          ratings: ratingArray,
        });

        await newProduct.save();
      }

      // // check if product already exists or not
      // const isProductExist = await Product.findOne({ title });
      // if (isProductExist) {
      //   throw new BadRequestError("Product already exists");
      // }

      // // //create new product
      // const newProduct = Product.build({
      //   title,
      //   price,
      //   img,
      //   category,
      //   description,
      //   sizes,
      //   color,
      //   avaliableQuantity,
      //   flashSale,
      //   gender,
      //   inStock,
      // });

      // // save the product in the db
      // await newProduct.save();

      res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
      next(error);
    }
  }
);

export { router as createProductRouter };
