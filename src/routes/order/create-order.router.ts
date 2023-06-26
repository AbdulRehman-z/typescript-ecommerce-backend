import express, { NextFunction, Request, Response } from "express";
import { Order, OrderStatus } from "../../models/Order";
import { Product } from "../../models/Product";
import { User } from "../../models/User";
import {
  BadRequestError,
  currentUserMiddleware,
  NotFoundError,
  requireAuthMiddleware,
} from "../../common/src";
import { Cart } from "../../models/Cart";

const router = express.Router();

router.post(
  "/api/order/create-order",
  currentUserMiddleware,
  requireAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cartId, totalPrice } = req.body;

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

      // save the order in the db
      await order.save();
      await updatedUser!.save();

      res.status(201).send(order);
    } catch (error) {
      next(error);
    }
  }
);

export { router as createOrderRouter };
