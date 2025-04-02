import { type Request, type Response, type NextFunction } from "express";

import ApiError from "../exception";
export default function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApiError) {
    res.status(err.status).json({ data: err.message });
  }
  console.log(err);
  res.status(500).json({ data: "Internal server error" });
}
