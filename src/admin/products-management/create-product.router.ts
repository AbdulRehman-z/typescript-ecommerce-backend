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
      // const { title, price, img, description, size, color, categories } =
      //   req.body;

      // // check if product already exists or not
      // const isProductExist = await Product.findOne({ title });
      // if (isProductExist) {
      //   throw new BadRequestError("Product already exists");
      // }

      // random array of 60 numbers between 1 and 5
      const ratings = Array.from({ length: 60 }, () =>
        faker.datatype.number({
          min: 1,
          max: 5,
        })
      );

      // create 100000 products using fakerjs
      for (let i = 0; i < 10000; i++) {
        const newProduct = Product.build({
          available: true,
          title: faker.commerce.productName(),
          price: faker.commerce.price(),
          img: faker.image.url(),
          description: faker.commerce.productDescription(),
          sizes: ["S", "M", "L"],
          color: ["red", "green", "blue", "orange", "back"],
          gender: "male",
          category: faker.commerce.department() as any,
          AvaliableQuantity: faker.datatype.number({
            min: 1,
            max: 100,
          }),
          flashSale: {
            active: false,
            discount: faker.datatype.number({
              min: 0,
              max: 0,
            }),
            startDate: undefined,
            endDate: undefined,
          },
          ratings: ratings,
        });
        await newProduct.save();
        console.log(`Product no: ${i}`);
      }
      // //create new product
      // const newProduct = Product.build({
      //   title,
      //   price,
      //   img,
      //   categories,
      //   description,
      //   size,
      //   color,
      // });

      // save the product in the db
      // await newProduct.save();

      res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
      next(error);
    }
  }
);

export { router as createProductRouter };
