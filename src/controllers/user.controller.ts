import { Request, Response } from "express";
import { User } from "../models/User";
import { BadRequestError, NotFoundError } from "@underthehoodjs/commonjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const signinController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // check if user is registered or not
  const user = User.findOne({ email });
  if (!user) {
    throw new NotFoundError("You are not registered! Try signin first.");
  }

  // sign jwt
  const jwtToken = jwt.sign(
    {
      email,
    },
    process.env.SECTET_KEY!,
    {
      expiresIn: "14days",
    }
  );

  // attach the newly signed jwt token to authorization header
  req.headers.authorization = jwtToken;

  res.status(200).json({
    message: "Successfully signed in.",
    user,
  });
};

const signupController = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  // check if user already exists or not
  const user = await User.findOne({ email });
  if (user) {
    throw new BadRequestError(
      "User with this email already exists. Please try another email."
    );
  }

  // save the user in the db
  const newUser = User.build({ username, email, password });
  await newUser.save();

  // sign jwt
  const jwtToken = jwt.sign(
    {
      email,
    },
    process.env.SECRET_KEY!,
    {
      expiresIn: "14day",
    }
  );

  // attach the newly signed jwt token to authorization header
  req.headers.authorization = jwtToken;

  res.status(201).json({
    message: "Successfully signed in.",
    newUser,
  });
};

const currentuserController = async (req: Request, res: Response) => {};
