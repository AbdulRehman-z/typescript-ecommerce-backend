import express, { NextFunction, Request, Response } from "express";
import { Order, OrderStatus } from "../../models/Order";
import { Product, ProductDoc } from "../../models/Product";
import { User } from "../../models/User";
import {
  currentUserMiddleware,
  NotFoundError,
  requireAuthMiddleware,
} from "../../common/src";
import { Cart } from "../../models/Cart";
import { sendOrderConfirmationEmail } from "../../services/email.service";

const router = express.Router();

router.post(
  "/api/order/create-order",
  currentUserMiddleware,
  requireAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cartId } = req.body;

      let totalPrice: number;
      // check if order with the cart already exists
      const orderExists = await Order.findOne({ cartId });
      if (orderExists) {
        return res.status(200).send(orderExists);
      } else {
        // update the products in the cart to be sold
        const cart = await Cart.findById(cartId);

        if (!cart) {
          throw new NotFoundError("Cart not found");
        }

        const products = cart.products;
        const fetchedProducts: ProductDoc[] = [];
        const prices: any[] = [];

        // update the reserved quantity of the products
        await Promise.all(
          products.map(async (product) => {
            const productToUpdate = await Product.findById(product.productId);

            if (!productToUpdate) {
              throw new NotFoundError("Product not found");
            }

            const calcPrice =
              parseInt(productToUpdate.price) * product.quantity;
            prices.push(calcPrice);

            fetchedProducts.push(productToUpdate);

            productToUpdate.set({
              reservedQuantity:
                productToUpdate.reservedQuantity! - product.quantity,
              inStock: productToUpdate.inStock! - product.quantity,
            });

            await productToUpdate.save();
          })
        );

        // sum up total prices of all products in the prices array
        totalPrice = prices.reduce((a, b) => a + b, 0);

        // build the order
        const order = Order.build({
          userId: req.currentUser!.id,
          cartId,
          address: req.currentUser!.address,
          totalPrice,
          status: OrderStatus.Pending,
        });

        // save the order in user's order array
        const updatedUser = await User.findByIdAndUpdate(
          { _id: req.currentUser!.id },
          { $push: { orders: order }, $pull: { cart: cartId } },
          { new: true }
        );

        // add order id to the cart
        cart.set({ orderId: order.id });

        // save the order in the db
        await Promise.all([cart.save(), order.save(), updatedUser?.save()]);

        // send the order confirmation email
        await sendOrderConfirmationEmail(
          req.currentUser?.email!,
          req.currentUser?.address!,
          fetchedProducts,
          order
        );
        res.status(201).send(order);
      }
    } catch (error) {
      next(error);
    }
  }
);

export { router as createOrderRouter };
