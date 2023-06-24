// import express, { NextFunction, Request, Response } from "express";
// import { NotFoundError } from "../../common/src";
// import { Cart } from "../../models/Cart";

// const router = express.Router();

// router.put("/api/cart", async (req, res, next) => {
//   try {
//     const { userId, cartItems } = req.body;

//     // Retrieve the current cart of the user
//     const cart = await Cart.findOne({ userId });

//     if (!cart) {
//       // Cart not found
//       throw new NotFoundError("Cart not found");
//     }

//     // Iterate through the updated cart items
//     for (const updatedCartItem of cartItems) {
//       const { productId, quantity } = updatedCartItem;

//       // Find the cart item in the current cart
//       const cartItem = cart.cartItems.find(
//         (item) => item.productId === productId
//       );

//       if (!cartItem) {
//         // Cart item not found in the current cart
//         throw new NotFoundError("Cart item not found");
//       }

//       // Check if the quantity has been reduced
//       if (quantity < cartItem.quantity) {
//         // Update the quantity of the cart item
//         cartItem.quantity = quantity;

//         // If the quantity reaches 0 or less, remove the item from the cart
//         if (quantity <= 0) {
//           cart.cartItems = cart.cartItems.filter(
//             (item) => item.productId !== productId
//           );
//         }
//       }
//     }

//     // Save the updated cart
//     await cart.save();

//     res.status(200).json({ message: "Cart updated successfully" });
//   } catch (error) {
//     next(error);
//   }
// });

// // import exprees, { NextFunction, Request, Response } from "express";
// // import {
// //   BadRequestError,
// //   NotFoundError,
// //   currentUserMiddleware,
// //   requireAuthMiddleware,
// // } from "../../common/src";
// // import { Product } from "../../models/Product";

// // const router = exprees.Router();

// // router.post(
// //   "/api/cart/update-cart",
// //   currentUserMiddleware,
// //   requireAuthMiddleware,
// //   async (req: Request, res: Response, next: NextFunction) => {
// //     try {
// //       const { productId, quantity } = req.body;

// //       // Find the product with the provided id
// //       const product = await Product.findById(productId);

// //       // If no product found, throw an error
// //       if (!product) {
// //         throw new NotFoundError("Product not found");
// //       }

// //       // // If product is available and the quantity is less than the avaliable quantity, update the product
// //       // if (quantity < product.avaliableQuantity && product.available) {
// //       //   product.set({
// //       //     reservedQuantity: product.reservedQuantity + quantity,
// //       //     avaliableQuantity: product.avaliableQuantity - quantity,
// //       //   });
// //       //   await product.save();
// //       // }
// //       console.log("product: ", product);

// //       res.status(200).json(product);
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// // );

// // export { router as addToCartRouter };
