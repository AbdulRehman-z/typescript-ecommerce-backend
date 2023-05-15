import { connectDb } from "./services/mongoose.service";
import { app } from "./app";
import dotenv from "dotenv";
dotenv.config();

app.listen(process.env.PORT, async () => {
  await connectDb();
  console.log("Server is running on port:", process.env.PORT);
});
