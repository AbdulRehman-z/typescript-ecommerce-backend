import bull from "bull";
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
