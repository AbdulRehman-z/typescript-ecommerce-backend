import * as dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import { ProductDoc } from "../models/Product";
import { OrderDoc } from "../models/Order";
import { Address } from "../models/User";

// Send reset email
export const sendResetEmail = async (email: string, resetToken: string) => {
  try {
    const resetLink = `http://localhost:5000/reset-password/${resetToken}`;

    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL_SRV,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL_SRV,
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

export const sendOrderConfirmationEmail = async (
  email: string,
  address: Address,
  products: ProductDoc[],
  order: OrderDoc
) => {
  try {
    console.log("------------------------------------");
    console.log(products);
    console.log("------------------------------------");

    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL_SRV,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL_SRV,
      to: email,
      subject: "Order Confirmation",
      text: `Thank you for your order!`,
      // create a beautiful html version of the email
      html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
    }

    h1, h2 {
      color: #333;
    }

    table {
      border-collapse: collapse;
      width: 100%;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    th {
      background-color: #f2f2f2;
    }
  </style>
</head>
<body>
  <h1>Thank you for your order!</h1>
  <h2>Order Details</h2>
  <p>Order ID: ${order._id}</p>
  <p>Order Status: ${order.status}</p>
  
  <h2>Shipping Address</h2>
  <p>Address: ${address.street}</p>
  <p>Country: ${address.country}</p>
  <p>State: ${address.state}</p>
  <p>Zip Code: ${address.zipCode}</p>
  <p>Phone Number: ${address.phoneNumber}</p>
  
  <h2>Order Items</h2>
  <table>
    <tr>
      <th>Product</th>
      <th>Quantity</th>
      <th>Price</th>
    </tr>
    ${products.map((product: any) => {
      return `
      <tr>
        <td>${product.name}</td>
        <td>${product.quantity}</td>
        <td>${product.price}</td>
      </tr>
      `;
    })}
  </table>
  
  <h2>Order Summary</h2>
  <p>Total: ${order.totalPrice}</p>
  
  <h2>Thank you for shopping with us!</h2>
</body>
</html>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Error sending order confirmation email" + error);
  }
};

// <p>Items: ${order.itemsPrice}</p>
// <p>Shipping: ${order.shippingPrice}</p>
// <p>Tax: ${order.taxPrice}</p>
