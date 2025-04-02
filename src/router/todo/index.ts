import express from "express";

import authMiddleware from "../../middlewares/auth-middleware";
import tryCatch from "../../middlewares/try-catch-middleware";

import todoController from "../../controllers/todo.controller";

const router = express.Router();

router.get("/get-todos", authMiddleware, tryCatch(todoController.getTodos));
router.post("/add-todo", authMiddleware, tryCatch(todoController.addTodo));
router.delete("/delete-todo/:id", authMiddleware, tryCatch(todoController.deleteTodo));
router.patch("/update-todo/:id", authMiddleware, tryCatch(todoController.updateTodo));

export default router;
