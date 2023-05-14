import { Request, Response } from "express";
import { User } from "../../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Password } from "../../services/password.service";
dotenv.config();

const currentuserController = async (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
};

export { currentuserController };
