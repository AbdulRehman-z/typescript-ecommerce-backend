import express, { Request, Response } from "express";
import { User } from "../../models/User";
import { Password } from "../../services/password.service";
import {
  NotAuthorizedError,
  NotFoundError,
  validateRequestMiddleware,
  requireAuthMiddleware,
} from "../../common/src";
import { body } from "express-validator";

const router = express.Router();

router.put(
  "/api/users/update",
  [
    body("username").not().isEmpty().withMessage("Username is required"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequestMiddleware,
  requireAuthMiddleware,

  async (req: Request, res: Response) => {
    const { newusername, password, gender, address } = req.body;

    const user = await User.findById(req.currentUser?.id);
    if (!user) {
      throw new NotFoundError("Failde to fetch the user!");
    }

    // validate password
    const isPasswordValid = Password.validatePassowrd(user.password, password);
    if (!isPasswordValid) {
      throw new NotAuthorizedError("Invalid credientials!");
    }

    // update username
    user.set({
      username: newusername,
    });
    await user?.save();

    res.status(200).send(user);
  }
);

export { router as updateUserRouter };
