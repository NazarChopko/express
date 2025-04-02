import { body, check } from "express-validator";

export const validateUser = [
  body("email")
    .optional()
    .isString()
    .withMessage("Email must be string")
    .isEmail()
    .withMessage("Email format is invalid"),

  body("password")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Password is required")
    .isString()
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be at least 8 characters long"),
];

export const validateUserInfo = [
  body("address").notEmpty().withMessage("Address is required"),
  body("userName").notEmpty().withMessage("User name is required"),
];
