import express from "express";
import dotenv from "dotenv";
import { errorHandlerMiddleware } from "./common/src";
import cookieSession from "cookie-session";
import { signinRouter } from "./routes/user/signin.router";
import { signupRouter } from "./routes/user/signup.router";
import { currentuserRouter } from "./routes/user/currentuser.router";
import { updateUserRouter } from "./routes/user/updateuser.router";
import { signoutUserRouter } from "./routes/user/signout.router";
import { createProductRouter } from "./routes/product/create-product.router";
import { getProductsRouter } from "./routes/product/get-products.router";
import { getProductRouter } from "./routes/product/get-product.router";
import { getProductsByCategoryRouter } from "./routes/product/get-product-by-category.router";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieSession({ signed: false, secure: false }));

/*
UserRoutes
**/
app.use(signinRouter);
app.use(signupRouter);
app.use(currentuserRouter);
app.use(updateUserRouter);
app.use(signoutUserRouter);

/*
ProductRoutes
**/
app.use(createProductRouter);
app.use(getProductsRouter);
app.use(getProductRouter);
app.use(getProductsByCategoryRouter);

app.use(errorHandlerMiddleware);

export { app };
