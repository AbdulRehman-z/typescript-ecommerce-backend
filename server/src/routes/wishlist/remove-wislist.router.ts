import expres, { Request, Response, NextFunction } from "express";
import { User } from "../../models/User";
import { currentUserMiddleware, requireAuthMiddleware } from "../../common/src";

const router = expres.Router();

router.post(
  "/api/wishlist/remove",
  currentUserMiddleware,
  requireAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.body;
      const user = await User.findById(req.currentUser!.id);

      if (!user) {
        throw new Error("User not found");
      }

      user.set({ wishlist: user.wishlist.filter((id) => id !== productId) });
      await user.save();
      res.status(201).send(user);
    } catch (error) {
      next(error);
    }
  }
);

export { router as removeWishlistRouter };
