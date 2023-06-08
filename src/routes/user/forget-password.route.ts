import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../../models/User";
import { NotFoundError } from "../../common/src";
import { Password } from "../../services/password.service";
import { sendResetEmail } from "../../services/email.service";
import { validateRequestMiddleware } from "../../common/src";

const router = express.Router();

// Route for initiating password reset
router.post(
  "/api/users/forgot-password",
  [body("email").isEmail().withMessage("Please provide a valid email")],
  validateRequestMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    let user;

    try {
      const { email } = req.body;

      // Find the user by email
      user = await User.findOne({ email });

      if (!user) {
        // User not found
        throw new NotFoundError("User not found");
      }

      // Generate reset token
      const resetToken = Password.generateResetToken();

      // Save the reset token and its expiration time in the user document
      user.resetToken = resetToken;
      user.resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour
      await user.save();

      // Send reset email
      await sendResetEmail(email, resetToken);

      res.status(200).json({ message: "Reset email sent" });
    } catch (error) {
      // revert the changes made to user doc if email sending fails for some reason
      if (user) {
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        user.save();
      }

      next(error);
    }
  }
);

export { router as forgotPasswordRouter };
