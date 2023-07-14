import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Address } from "../../../types/types";

interface UserPayload {
  id: string;
  email: string;
  isAdmin: boolean;
  address: Address;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
      session?: any;
    }
  }
}

export const currentUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  // this trycatch block will detect if there is a jwt that is tempered by some malicious user
  // our jwt must be verified if it is signed with our process.env.JWT_KEY And if someone tampered with our jwt
  // then the verification process will be failed because our process.env.JWT_KEY will automatically know that
  // it is not the same jwt that I issued during sign the jwt

  try {
    const decodePayload = jwt.verify(
      req.session.jwt,
      process.env.SECRET_KEY!
    ) as UserPayload;

    req.currentUser = decodePayload;
  } catch (error) {
    throw new Error("Invalid JWT");
  }

  next();
};
