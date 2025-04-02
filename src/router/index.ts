import express from "express";

import userRouter from "./user/index";
import todoRouter from "./todo";

const router = express.Router();

router.use(userRouter);
router.use(todoRouter);

export default router;
