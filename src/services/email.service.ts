import * as dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import { ProductDoc } from "../models/Product";
import { OrderDoc } from "../models/Order";
import { Address, OrderStatus } from "../types/types";

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

export const sendOrderConfirmationEmail = async (
  email: string,
  address: Address,
  order: OrderDoc,
  products?: ProductDoc[]
) => {
  try {
    console.log("Products:", products);
    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL_SRV,
        pass: process.env.PASS,
      },
    });

    let emailSubject = "";
    let emailHtml = "";

    const styles = `

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

    img {
      width: 40px;
      height: 40px;
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
    `;

    // Set email content based on the order status
    switch (order.status) {
      case OrderStatus.Pending:
        emailSubject = "Order Confirmation - Pending";
        emailHtml = `<!DOCTYPE html>
          <html>
          <head>
            <style>
              ${styles}
            </style>
          </head>
          <body>
            <h1>Thank you for your order!</h1>
            <h2>Order Details</h2>
            <p>Order ID: ${order._id}</p>
            <p>Order Status: ${order.status}</p>
            
            <h2>Shipping Address</h2>
            <p>Address: ${address.street}, ${address.state}, ${
          address.zipCode
        }, ${address.country}</p>
            
            <h2>Ordered Products</h2>
            <table>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
              ${products?.map((product: any) => {
                return `
                <tr>
                  <td>${product.productInDb.title}</td>
                  <td>${product.quantity}</td>
                  <td>${product.quantity} X ${product.productInDb.price} = ${
                  product.quantity * product.productInDb.price
                }</td>
                </tr>`;
              })}
            </table>
            
            <h2>Order Summary</h2>
            <p>Total: ${order.totalPrice}</p>
            
            <h2>Thank you for shopping with us!</h2>
          </body>
          </html>`;
        break;
      case OrderStatus.Processing:
        // Add CSS styling for processing status
        emailSubject = "Order Confirmation - Processing";
        emailHtml = `<!DOCTYPE html>
          <html>
          <head>
            <style>
             ${styles}
            </style>
          </head>
          <body>
            <>Your order is being processed.</p>
            <h2>Shipping Address</h2>
              <p>Address: ${address.street}, ${address.state}, ${address.zipCode}, ${address.country}</p>
            <h2>Order Details</h2>
             <p>Order Status: ${order.status}</p>
            <h2>Thank you for shopping with us!</h2>
          </body>
          </html>`;
        break;
      case OrderStatus.Shipped:
        // Add CSS styling for shipped status
        emailSubject = "Order Confirmation - Shipped";
        emailHtml = `<!DOCTYPE html>
          <html>
          <head>
            <style>
            ${styles}
            </style>
          </head>
          <body>
            <h1>Your order has been shipped!</h1>
            <h2>Shipping Address</h2>
              <p>Address: ${address.street}, ${address.state}, ${address.zipCode}, ${address.country}</p>
            <h2>Order Details</h2>
             <p>Order Status: ${order.status}</p>
            <h2>Thank you for shopping with us!</h2>
          </body>
          </html>`;
        break;
      case OrderStatus.Delivered:
        // Add CSS styling for delivered status
        emailSubject = "Order Confirmation - Delivered";
        emailHtml = `<!DOCTYPE html>
          <html>
          <head>
            <style>
            ${styles}
            </style>
          </head>
          <body>
            <h1>Your order has been delivered!</h1>
            <h2>Shipping Address</h2>
              <p>Address: ${address.street}, ${address.state}, ${address.zipCode}, ${address.country}</p>
            <h2>Order Details</h2>
              <p>Order Status: ${order.status}</p>
            <h2>Thank you for shopping with us!</h2>
          </body>
          </html>`;
        break;
      case OrderStatus.Cancelled:
        // Add CSS styling for cancelled status
        emailSubject = "Order Confirmation - Cancelled";
        emailHtml = `<!DOCTYPE html>
          <html>
          <head>
            <style>
            ${styles}
            </style>
          </head>
          <body>
            <h1>Your order has been cancelled!</h1>
            <h2>Order Details</h2>
              <p>Order Status: ${order.status}</p>
            <h2>Please contact us if you have any questions.</h2>
            <h2>Here is our contact information:</h2>
             <p>Phone: 123-456-7890</p>
             <p>Email: ${process.env.ADMIN_EMAIL_SRV}</p>
            <h2>Thank you for shopping with us!</h2>
          </body>
          </html>`;
        break;
      case OrderStatus.Returned:
        // Add CSS styling for returned status
        emailSubject = "Order Confirmation - Returned";
        emailHtml = `<!DOCTYPE html>
          <html>
          <head>
            <style>
            ${styles}
            </style>
          </head>
          <body>
            <h1>Your order has been returned!</h1>
            <h2>Order Details</h2>
              <p>Order Status: ${order.status}</p>
            <h2>Please contact us if you have any questions.</h2>
            <h2>Here is our contact information:</h2>
              <p>Phone: 123-456-7890</p>
              <p>Email: ${process.env.ADMIN_EMAIL_SRV}</p>
            <h2>We will be happy to help you!</h2>
          </body>
          </html>`;
        break;

      case OrderStatus.Refunded:
        // Add CSS styling for refunded status
        emailSubject = "Order Confirmation - Refunded";
        emailHtml = `<!DOCTYPE html>
          <html>
          <head>
           <style>
           ${styles}
           </style>
          </head>
          <body>
            <h1>Your order has been refunded!</h1>
            <h2>Order Details</h2>
              <p>Order Status: ${order.status}</p>
            <h2>Please contact us if you have any questions.</h2>
            <h2>A refund will be issued to your original payment method.</h2>
            <h2>Here is our contact information:</h2>
              <p>Phone: 123-456-7890</p>
              <p>Email: ${process.env.ADMIN_EMAIL_SRV}</p>
            <h2>We will be happy to help you!</h2>
          </body>
          </html>`;
        break;

      default:
        // Add default CSS styling for other order statuses
        emailSubject = "Order Confirmation";
        emailHtml = `<!DOCTYPE html>
          <html>
          <head>
            <style>
            ${styles}
            </style>
          </head>
          <body>
            <h1>Thank you for your order!</h1>
            <h2>Shipping Address</h2>
              <p>Address: ${address.street}, ${address.state}, ${address.zipCode}, ${address.country}</p>
            <h2>Order Details</h2>
              <p>Order Status: ${order.status}</p>
            <h2>Thank you for shopping with us!</h2>
          </body>
          </html>`;
        break;
    }

    const mailOptions = {
      from: process.env.ADMIN_EMAIL_SRV,
      to: email,
      subject: emailSubject,
      html: emailHtml,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Error sending order confirmation email: " + error);
  }
};
