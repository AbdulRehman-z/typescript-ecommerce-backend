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
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Error sending reset email");
  }
};

// Send order confirmation email

export const sendOrderConfirmationEmail = async (email: string, order: any) => {
  try {
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
      subject: "Order Confirmation",
      text: `Thank you for your order!`,
      // create a beautiful html version of the email
      html: ` 
      <h1>Thank you for your order!</h1>
      <h2>Order Details</h2>
      <p>Order ID: ${order._id}</p>
      <p>Order Status: ${order.status}</p>
      <p>Order Total: ${order.totalPrice}</p>
      <p>Order Date: ${order.createdAt}</p>
      <h2>Shipping Address</h2>
      <p>Address: ${order.address.address}</p>
      <p>City: ${order.address.city}</p>
      <p>Postal Code: ${order.address.postalCode}</p>
      <p>Country: ${order.address.country}</p>
      <h2>Order Items</h2>
      <table style="width:100%">
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
        ${
          order.products &&
          order.products.map((product: any) => {
            return `
          <tr>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.price}</td>
          </tr>
          `;
          })
        }
      </table>
      <h2>Payment Method</h2>
      <p>Method: ${order.paymentMethod}</p>
      <h2>Order Summary</h2>
      <p>Total: ${order.totalPrice}</p>
      <h2>Thank you for shopping with us!</h2>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Error sending order confirmation email");
  }
};

// <p>Items: ${order.itemsPrice}</p>
// <p>Shipping: ${order.shippingPrice}</p>
// <p>Tax: ${order.taxPrice}</p>
