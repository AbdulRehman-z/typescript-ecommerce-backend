import { Request, Response } from "express";
import { User } from "../../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Password } from "../../services/password.service";
import express from "express";
import { currentUserMiddleware } from "../../common/src";
dotenv.config();

const router = express.Router();

router.get(
  "/api/users/currentuser",
  currentUserMiddleware,
  async (req: Request, res: Response) => {
    res.status(200).send({ currentUser: req.currentUser || null });
  }
);

export { router as currentuserRouter };
