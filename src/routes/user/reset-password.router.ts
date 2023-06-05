import express, { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import { Password } from "../../services/password.service";
import { BadRequestError } from "../../common/src";

const router = express.Router();

// Route for resetting password with the token
router.post(
  "/reset-password/:token",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      // Find the user by reset token and check its expiration
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
      });

      if (!user) {
        // Invalid or expired token
        throw new BadRequestError("Invalid or expired token!");
      }

      // Reset the password
      const hashedPassword = Password.genPasswordHash(password);
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      await user.save();

      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      next(error);
    }
  }
);
