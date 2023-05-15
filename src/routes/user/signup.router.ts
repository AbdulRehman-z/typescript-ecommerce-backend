import express, { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import { BadRequestError, validateRequest } from "../../common/src";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
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
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password, isAdmin } = req.body;

      // check if user already exists or not
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError(
          "User with this email already exists. Please try another email."
        );
      }

      // save the user in the db
      const newUser = User.build({ username, email, password, isAdmin });
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

      console.log("jwtToken:", jwtToken);

      // attach the newly signed jwt token to session object
      req.session = {
        jwt: jwtToken,
      };

      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

export { router as signupRouter };
