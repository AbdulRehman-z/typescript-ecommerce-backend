import { Request, Response } from "express";
import { User } from "../../models/User";
import { BadRequestError } from "../../common/src";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Password } from "../../services/password.service";
dotenv.config();

const signupController = async (req: Request, res: Response) => {
  const { username, email, password, isAdmin } = req.body;

  // check if user already exists or not
  const user = await User.findOne({ email });
  if (user) {
    throw new BadRequestError(
      "User with this email already exists. Please try another email."
    );
  }

  // save the user in the db
  const newUser = User.build({ username, email, password, isAdmin });
  await newUser.save();

  // sign jwt
  const jwtToken = jwt.sign(
    {
      id: newUser.id,
      isAdmin: newUser.isAdmin,
    },
    process.env.SECRET_KEY!,
    {
      expiresIn: "14day",
    }
  );

  console.log("jwtToken:", jwtToken);

  // attach the newly signed jwt token to session object
  req.session = {
    jwt: jwtToken,
  };

  res.status(201).json(newUser);
};

export { signupController };
