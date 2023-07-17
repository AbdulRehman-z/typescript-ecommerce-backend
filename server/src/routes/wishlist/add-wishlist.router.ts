import express, { Request, Response, NextFunction } from "express";
import { User } from "../../models/User";
import { currentUserMiddleware, requireAuthMiddleware } from "../../common/src";

const router = express.Router();

router.post(
  "/api/wishlist/add",
  currentUserMiddleware,
  requireAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.body;
      const user = await User.findById(req.currentUser!.id);
      if (!user) {
        throw new Error("User not found");
      }

      if (user.wishlist.includes(productId)) {
        throw new Error("Product already in wishlist");
      }

      user.set({ wishlist: [...user.wishlist, productId] });
      await user.save();
      res.status(201).send(user);
    } catch (error) {
      next(error);
    }
  }
);

export { router as addToWishlistRouter };
