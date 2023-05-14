import { Request, Response } from "express";
import { User } from "../../models/User";
import { NotFoundError, NotAuthorizedError } from "../../common/src";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Password } from "../../services/password.service";
dotenv.config();

const signinController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // check if user is registered or not
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("You are not registered! Try signin first.");
  }

  // validate password
  const isPasswordValid = Password.validatePassowrd(user.password, password);
  if (!isPasswordValid) {
    throw new NotAuthorizedError("Invalid credientials!");
  }

  // sign jwt
  const jwtToken = jwt.sign(
    {
      id: user.id,
      isAdmin: user.isAdmin,
    },
    process.env.SECRET_KEY!,
    {
      expiresIn: "14days",
    }
  );

  // attach the newly signed jwt token to session object
  req.session = {
    jwt: jwtToken,
  };

  res.status(200).json({
    message: "Successfully signed in.",
    user,
  });
};

export { signinController };
