import * as dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

// Send reset email
export const sendResetEmail = async (email: string, resetToken: string) => {
  try {
    const resetLink = `http://localhost:5000/reset-password/${resetToken}`;

    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: "Password Reset",
      text: `You are receiving this email because you (or someone else) has requested the reset of the password for your account.\n\n`,
      html: `<p>Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    };

    // Send the email
    const result = await transporter.sendMail(mailOptions);
    console.log("Reset email sent:", result);
  } catch (error) {
    throw new Error("Error sending reset email");
    // Handle error and provide appropriate feedback to the user
  }
};
