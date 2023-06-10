import express, { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import { BadRequestError, validateRequestMiddleware } from "../../common/src";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("username").not().isEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequestMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { username, email, password, isAdmin, gender, address } = req.body;

      if (process.env.ADMIN_EMAIL === email) {
        isAdmin = true;
      }
      // check if user already exists or not
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError(
          "User with this email already exists. Please try another email."
        );
      }

      // save the user in the db
      const newUser = User.build({
        username,
        email,
        password,
        isAdmin,
        gender,
        address,
      });
      await newUser.save();

      // sign jwt
      const jwtToken = jwt.sign(
        {
          id: newUser.id,
          isAdmin: newUser.isAdmin,
        },
        process.env.SECRET_KEY!,
        {
          expiresIn: "14day",
        }
      );

      // attach the newly signed jwt token to session object
      req.session = {
        jwt: jwtToken,
      };

      res.status(201).json("Success");
    } catch (error) {
      next(error);
    }
  }
);

export { router as signupRouter };

// // create 3000 users using fakerjs
//     for (let i = 0; i < 3000; i++) {
//       const user = User.build({
//         username: faker.internet.userName(),
//         email: faker.internet.email(),
//         password: faker.internet.password(),
//         isAdmin: false,
//         gender: faker.person.sex(),
//         address: {
//           street: faker.location.streetAddress(),
//           houseNumber: faker.number.int(),
//           state: faker.location.state(),
//           zipCode: parseInt(faker.location.zipCode()),
//           country: faker.location.country(),
//           phoneNumber: parseInt(faker.phone.number("+92 31 ### ## ## ")),
//           additionalInfo: faker.location.secondaryAddress(),
//         },
//       });
//       await user.save();
//     }
