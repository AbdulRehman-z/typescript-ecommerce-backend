import express from "express";
import { currentUserMiddleware, validateRequest } from "../common/src";
import { body } from "express-validator";
import { signinController } from "../controllers/user/signin.controller";
import { signupController } from "../controllers/user/signup.controller";
import { currentuserController } from "../controllers/user/currentuser.controller";

const router = express.Router();

// signin route
router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  signinController
);

// signup route
router.post(
  "/api/users/signup",
  [
    body("username").not().isEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  signupController
);

// currentUser
router.get(
  "/api/users/currentuser",
  currentUserMiddleware,
  currentuserController
);

export { router as userRouter };
