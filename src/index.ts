import express from "express";
import { connectDb } from "./services/mongoose.service";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.listen(process.env.PORT, async () => {
  await connectDb();
  console.log("Server is running on port:", process.env.PORT);
});
