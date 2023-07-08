import express, { NextFunction, Request, Response } from "express";
import { Order, OrderStatus } from "../../models/Order";
import { Product, ProductDoc } from "../../models/Product";
import { User } from "../../models/User";
import {
  currentUserMiddleware,
  NotFoundError,
  requireAuthMiddleware,
  BadRequestError,
} from "../../common/src";
import { Cart } from "../../models/Cart";
import { sendOrderConfirmationEmail } from "../../services/email.service";
import Bull from "bull";

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
      const cart = await Cart.findById(cartId);
      let fetchedCart = cart;

      // if cart has orderId, it means that order already processed
      if (cart?.orderId) {
        return res.status(200).send({ message: "Order already exists", cart });
      } else {
        // if cart doesn't have orderId, it means that order is not processed yet, proceed with the order
        const products = fetchedCart?.products;
        const fetchedProducts: ProductDoc[] = [];
        const prices: any[] = [];

        // update the reserved quantity of the products
        await Promise.all(
          // loop through all products in the cart
          products!.map(async (product) => {
            const productToUpdate = await Product.findById(product.productId);

            // if product is not found, throw an error
            if (!productToUpdate) {
              throw new NotFoundError("Product not found");
            }

            // calculate the total price of the product with respect to quantity and then push it to the prices array
            const calcPrice =
              parseInt(productToUpdate.price) * product.quantity;
            prices.push(calcPrice);

            // push the product to the fetchedProducts array, so that we can use it later to send the order confirmation email
            fetchedProducts.push(productToUpdate);

            // set the required fields on the product doc
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
        fetchedCart?.set({ orderId: order.id });

        // save the order in the db
        await Promise.all([
          fetchedCart?.save(),
          order.save(),
          updatedUser?.save(),
        ]);

        //

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
