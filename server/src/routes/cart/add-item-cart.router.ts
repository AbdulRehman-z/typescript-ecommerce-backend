import exprees, { NextFunction, Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  currentUserMiddleware,
  requireAuthMiddleware,
} from "../../common/src";
import { Product } from "../../models/Product";
import { Cart } from "../../models/Cart";
import { User } from "../../models/User";
import { expirationQueue } from "../../services/expiration-queue.service";

const router = exprees.Router();

router.post(
  "/api/cart/add-item",
  currentUserMiddleware,
  requireAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId, quantity } = req.body;

      // Find the product with the provided id
      const product = await Product.findById(productId);

      // If no product found, throw an error
      if (!product) {
        throw new NotFoundError("Product not found");
      }

      // If product is not available, throw an error
      if (!product.available) {
        throw new NotFoundError("Product is out of stock");
      }

      // If product is available but the quantity is greater than the avaliableQuantity quantity, throw an error
      if (quantity > product.avaliableQuantity && product.available) {
        throw new BadRequestError("Requested quantity is not available");
      }

      // If quantity is less than or equal to 0, throw an error
      if (quantity <= 0) {
        throw new BadRequestError("Invalid quantity");
      }

      // If avaliable quantity equals to quantity, set the product available to false and update the product
      if (quantity === product.avaliableQuantity) {
        product.set({
          available: false,
          reservedQuantity: product.reservedQuantity + quantity,
          avaliableQuantity: product.avaliableQuantity - quantity,
        });
        await product.save();
      }

      // If product is available and the quantity is less than the avaliable quantity, update the product
      if (quantity < product.avaliableQuantity && product.available) {
        product.set({
          reservedQuantity: product.reservedQuantity + quantity,
          avaliableQuantity: product.avaliableQuantity - quantity,
        });
        await product.save();
      }

      // now add the product to the cart
      const cart = await Cart.findOne({
        $and: [
          { userId: req.currentUser!.id },
          { orderId: null },
          { expired: false },
        ],
      });

      // if cart has already processed an order || there is no cart, create a new cart
      if (!cart) {
        // create a new cart
        const newCart = Cart.build({
          userId: req.currentUser!.id,
          products: [{ productId: product._id, quantity: quantity }],
        });

        // now add the item to the user cart array
        const user = await User.findById(req.currentUser!.id);

        if (!user) {
          throw new NotFoundError("User not found");
        }

        // if user cart length is > 0, it means there is already cart present
        if (user.cart.length === 0) {
          user.set({
            cart: [newCart._id],
          });

          await expirationQueue.add(
            { cartId: newCart._id, userId: user.id },
            {
              // delay for 15 minutes
              delay: 1800000,
            }
          );
          await user.save();
        }
        await newCart.save();
        res.status(200).json(newCart);
      } else if (cart.products.length > 0) {
        // check if product already exists in the cart, if exist, update the quantity
        cart.products.forEach(async (el) => {
          if (el.productId === product._id.toString()) {
            el.quantity += quantity;
            await cart.save();
          } else {
            cart.set({
              products: [
                ...cart.products,
                { productId: product._id, quantity },
              ],
            });
            await cart.save();
          }
          await expirationQueue.add(
            { cartId: cart._id, userId: cart.userId },
            {
              delay: 1800000,
            }
          );
        });
        res.status(200).json(cart);
      } else {
        // add the product to the cart
        cart.set({
          products: [{ productId: product._id, quantity }],
        });
        await cart.save();
        res.status(200).json(cart);
      }
    } catch (error) {
      next(error);
    }
  }
);

export { router as addToCartRouter };
