import express from "express";
import { connectDb } from "./services/mongoose.service";
import dotenv from "dotenv";
import { userRouter } from "./routes/user.router";
import { errorHandlerMiddleware } from "./common/src";
import cookieSession from "cookie-session";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieSession({ signed: false, secure: false }));

app.use(userRouter);

app.use(errorHandlerMiddleware);

app.listen(process.env.PORT, async () => {
  await connectDb();
  console.log("Server is running on port:", process.env.PORT);
});
