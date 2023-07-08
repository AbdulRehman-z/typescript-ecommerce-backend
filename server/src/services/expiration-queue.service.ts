import bull from "bull";
import QueueMQ from "bullmq";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";

import { Cart } from "../models/Cart";
import { User } from "../models/User";

interface Payload {
  cartId: string;
  userId: string;
}

export const expirationQueue = new bull<Payload>("order:expiration", {
  redis: { port: 6379, host: "127.0.0.1" },
});

expirationQueue.process(async (job) => {
  try {
    const { cartId } = job.data;

    // remove the cart id from users cart array and delete the cart from the cart collection
    const cart = await Cart.findById(cartId);
    const user = await User.findByIdAndUpdate(
      cart!.userId,
      {
        $pull: { cart: cartId },
      },
      { new: true }
    );

    await Promise.all([cart!.delete(), user!.save()]);
  } catch (error) {
    console.log(error);
  }
});

// const { createBullBoard } = require("@bull-board/api");
// const { BullAdapter } = require("@bull-board/api/bullAdapter");
// const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");
// const { ExpressAdapter } = require("@bull-board/express");

// const someQueue = new Queue("someQueueName", {
//   redis: { port: 6379, host: "127.0.0.1", password: "foobared" },
// }); // if you have a special connection to redis.
// const someOtherQueue = new Queue("someOtherQueueName");
// const queueMQ = new QueueMQ("queueMQName");

// export const serverAdapter = new ExpressAdapter();

// const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
//   queues: [new BullAdapter(expirationQueue)],
//   serverAdapter: serverAdapter,
// });
