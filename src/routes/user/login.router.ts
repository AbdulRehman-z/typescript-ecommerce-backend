import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import {
  NotFoundError,
  NotAuthorizedError,
  validateRequestMiddleware,
  currentUserMiddleware,
} from "../../common/src";
import jwt from "jsonwebtoken";
import express from "express";
import dotenv from "dotenv";
import { body } from "express-validator";

import { Password } from "../../services/password.service";
dotenv.config();

const router = express.Router();

router.post(
  "/api/users/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequestMiddleware,
  currentUserMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // check if user is registered or not
      const user = await User.findOne({ email });
      if (!user) {
        throw new NotFoundError("You are not registered! Try to signup first.");
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
          email: user.email,
          address: user.address,
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

export { router as loginRouter };
