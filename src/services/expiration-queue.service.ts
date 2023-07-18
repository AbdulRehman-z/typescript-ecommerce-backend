import bull from "bull";
import { Cart } from "../models/Cart";
import { User } from "../models/User";
import { Product } from "../models/Product";
import { NotFoundError } from "../common/src";

interface Payload {
  cartId: string;
  userId: string;
}

export const expirationQueue = new bull<Payload>("order:expiration", {
  redis: { port: 6379, host: "127.0.0.1" },
});

expirationQueue.on("completed", async (job) => {
  console.log("Job completed", job.data);
});

expirationQueue.on("waiting", (jobId) => {
  console.log("Job waiting", jobId);
});
expirationQueue.on("failed", (job, err) => {
  console.log("Job failed", job.data);
});

expirationQueue.on("error", (err) => {
  console.log("Job error", err);
});

expirationQueue.on("waiting", (jobId) => {
  console.log("Job waiting", jobId);
});

expirationQueue.on("active", (job) => {
  console.log("Job active", job.data);
});

expirationQueue.on("removed", (job) => {
  console.log("Job removed", job);
});

expirationQueue.process(async (job) => {
  try {
    const { cartId } = job.data;

    // set the cart expired to true & add the products quantity that are in the cart.products array back to their respective products
    const cart = await Cart.findById(cartId);

    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.set({
      expired: true,
    });

    const products = cart.products;

    const updatedProducts = products!.map(async (product) => {
      const productToUpdate = await Product.findById(product.productId);

      // if product is not found, throw an error
      if (!productToUpdate) {
        throw new NotFoundError("Product not found");
      }

      // set the required fields on the product doc
      productToUpdate.set({
        reservedQuantity: productToUpdate.reservedQuantity! - product.quantity,
        inStock: productToUpdate.inStock! + product.quantity,
      });

      await productToUpdate.save();
    });

    const user = await User.findByIdAndUpdate(
      cart!.userId,
      {
        $pull: { cart: cartId },
      },
      { new: true }
    );

    await Promise.all([cart!.save(), user!.save(), ...updatedProducts]);
  } catch (error) {
    console.log(error);
  }
});
