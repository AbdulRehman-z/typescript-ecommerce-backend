import * as dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

console.log(process.env.ADMIN_EMAIL);
console.log(process.env.PASS);

// Send reset email
export const sendResetEmail = async (email: string, resetToken: string) => {
  try {
    // Compose the email

    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.PASS,
      },
    });

    console.log(process.env.ADMIN_EMAIL);
    console.log(process.env.PASS);
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: ${resetToken}`,
    };

    // Send the email
    const result = await transporter.sendMail(mailOptions);
    console.log("Reset email sent:", result);
  } catch (error) {
    throw new Error("Error sending reset email");
    // Handle error and provide appropriate feedback to the user
  }
};
