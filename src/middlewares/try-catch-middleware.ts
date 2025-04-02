import { Request, Response, NextFunction } from "express";

const tryCatch = <D, R extends Request>(
  ctrl: (req: R, res: Response, next: NextFunction) => Promise<D | D[] | null>,
) => {
  return async (req: R, res: Response, next: NextFunction) => {
    try {
      const data = await ctrl(req, res, next);

      if (data === null) {
        res.sendStatus(204);
        return;
      }
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
};

export default tryCatch;
