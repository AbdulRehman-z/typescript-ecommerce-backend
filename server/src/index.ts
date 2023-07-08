import { connectDb } from "./services/mongoose.service";
import { app } from "./app";
import dotenv from "dotenv";
import { expirationQueue } from "./services/expiration-queue.service";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { serverAdapter } from "./app";

dotenv.config();

console.clear();

app.listen(process.env.PORT, async () => {
  await connectDb();

  createBullBoard({
    queues: [new BullAdapter(expirationQueue)],
    serverAdapter: serverAdapter,
  });

  // start processing the jobs
  expirationQueue.on("completed", async (job) => {
    console.log("Job completed:", job.data);
  });
  expirationQueue.on("failed", async (job, error) => {
    console.log("Job failed:", job.data);
    console.log(error);
  });

  console.log("Server is running on port:", process.env.PORT);
});
