import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import {
  NotFoundError,
  NotAuthorizedError,
  validateRequest,
  currentUserMiddleware,
  BadRequestError,
} from "../../common/src";
import jwt from "jsonwebtoken";
import express from "express";
import dotenv from "dotenv";
import { body } from "express-validator";

import { Password } from "../../services/password.service";
dotenv.config();

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  currentUserMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (req.currentUser) {
        throw new BadRequestError("You are already signed in!");
      }

      // check if user is registered or not
      const user = await User.findOne({ email });
      if (!user) {
        throw new NotFoundError("You are not registered! Try signin first.");
      }

      // validate password
      const isPasswordValid = Password.validatePassowrd(
        user.password,
        password
      );
      if (!isPasswordValid) {
        throw new NotAuthorizedError("Invalid credientials!");
      }

      // sign jwt
      const jwtToken = jwt.sign(
        {
          id: user.id,
          isAdmin: user.isAdmin,
        },
        process.env.SECRET_KEY!,
        {
          expiresIn: "14days",
        }
      );

      // attach the newly signed jwt token to session object
      req.session = {
        jwt: jwtToken,
      };

      res.status(200).json({
        user,
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as signinRouter };
