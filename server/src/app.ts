import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import { errorHandlerMiddleware } from "./common/src";
import { loginRouter } from "./routes/user/login.router";
import { signupRouter } from "./routes/user/signup.router";
import { currentuserRouter } from "./routes/user/currentuser.router";
import { updateUserRouter } from "./routes/user/updateuser.router";
import { signoutUserRouter } from "./routes/user/signout.router";
import { createProductRouter } from "./admin/products-management/create-product.router";
import { getProductsRouter } from "./routes/product/get-products.router";
import { getProductRouter } from "./routes/product/get-product.router";
import { getProductsByCategoryRouter } from "./routes/product/get-product-by-category.router";
import { resetPasswordRouter } from "./routes/user/reset-password.router";
import { forgotPasswordRouter } from "./routes/user/forget-password.route";
import { updateProductRouter } from "./admin/products-management/update-product-router";
import { addToCartRouter } from "./routes/cart/add-item-cart.router";
import { deleteCartItemRouter } from "./routes/cart/delete-cart-item.router";
import { createOrderRouter } from "./routes/order/create-order.router";
import { ExpressAdapter } from "@bull-board/express";
import { updateOrderStatusRouter } from "./admin/orders-management/order-status-update.router";
import { getOrderRouter } from "./admin/orders-management/order-retrieve.router";
import { getOrdersRouter } from "./admin/orders-management/order-list.router";
import { salesRevenueRouter } from "./admin/sales-management/sales-revenue.router";
import { totalOrdersRouter } from "./admin/sales-management/total-orders.router";
import { topSellingProductsRouter } from "./admin/sales-management/top-selling-products.router";
dotenv.config();

const app = express();
const serverAdapter = new ExpressAdapter();

/*
Configurations 
**/
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieSession({ signed: false, secure: false }));
serverAdapter.setBasePath("/admin/queues");

/*
UserRoutes
**/
app.use(loginRouter);
app.use(signupRouter);
app.use(currentuserRouter);
app.use(updateUserRouter);
app.use(signoutUserRouter);
app.use(resetPasswordRouter);
app.use(forgotPasswordRouter);

/*
ProductRoutes
**/
app.use(createProductRouter);
app.use(updateProductRouter);
app.use(getProductsRouter);
app.use(getProductRouter);
app.use(getProductsByCategoryRouter);

/*
CartRoutes
**/
app.use(addToCartRouter);
app.use(deleteCartItemRouter);

/*
OrderRoutes
**/
app.use(createOrderRouter);

/*
AdminRoutes
**/
app.use(updateOrderStatusRouter);
app.use(getOrderRouter);
app.use(getOrdersRouter);
app.use(totalOrdersRouter);
app.use(createProductRouter);
app.use(updateProductRouter);
app.use(salesRevenueRouter);
app.use(topSellingProductsRouter);

/*
BullBoard Routes
**/
serverAdapter.setBasePath("/admin/queues");
app.use("/admin/queues", serverAdapter.getRouter());

/*
Error Handler
**/
app.use(errorHandlerMiddleware);

export { app, serverAdapter };
