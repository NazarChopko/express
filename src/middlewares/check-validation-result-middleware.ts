import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ApiError from "../exception";

const checkValidationResult = (req: Request, _: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = ApiError.badRequest(errors.array({ onlyFirstError: true })[0].msg);
    return next(error);
  }
  next();
};

export default checkValidationResult;
