import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../../models/User";
import { NotFoundError } from "../../common/src";
import { Password } from "../../services/password.service";

const router = express.Router();

// Route for initiating password reset
router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

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
    console.error("Error initiating password reset:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
