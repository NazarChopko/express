import { Request, Response, NextFunction } from "express";
import config from "config";
import jwt from "jsonwebtoken";
import prisma from "../../prismaClient";

import ApiError from "../exception";
import { type Config } from "../types/config";
import { User } from "../types/user";

const appConfig: Config = config.get("app");

export default async function (req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token || token === "null") {
      return next(ApiError.forbidden("You are not authorized!"));
    }

    const validatedToken = jwt.verify(token, appConfig.secretKey) as User;

    const user = await prisma.user.findUnique({
      where: { email: validatedToken.email },
    });

    if (!user) {
      return next(ApiError.unauthorized("Somethink with your credentials!"));
    }

    const userDto = {
      id: user.id,
      email: user.email,
    };

    req.user = userDto;
    next();
  } catch (e) {
    return next(ApiError.unauthorized("Somethink with your credentials!"));
  }
}
