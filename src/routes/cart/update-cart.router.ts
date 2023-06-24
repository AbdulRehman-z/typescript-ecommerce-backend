import express, { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../../common/src";
import { Cart } from "../../models/Cart";

const router = express.Router();

router.put("/api/cart", async (req, res, next) => {
  try {
    res.status(200).json({ message: "Cart updated successfully" });
  } catch (error) {
    next(error);
  }
});
