import prisma from "../../../prismaClient";
import type { Todo } from "../../types/todo";
import ApiError from "../../exception";
import smtp from "../mail.service/";

class TodoService {
  async getTodos() {
    const todos = await prisma.todo.findMany({ orderBy: { createdAt: "desc" } });
    if (!todos) return [];
    return todos;
  }

  async createTodo(id: number, todo: Todo) {
    try {
      await prisma.todo.create({
        data: {
          text: todo.text,
          isCompleted: todo.isCompleted,
          id: todo.id,
          userId: id,
        },
      });

      const getAllTodos = await prisma.todo.findMany({ where: { userId: id }, orderBy: { createdAt: "desc" } });
      try {
        smtp.sendMail("nazarchopko.business@gmail.com", "test", "welcome", {
          name: { firstName: "Nazarchopko" },
          id: "1",
          project_name: "UkraineNow",
          company_name: "UkraineNow",
          date: new Date().toDateString(),
        });
      } catch (error) {
        throw ApiError.internal("Something went wrong in mail!");
      }
      return getAllTodos;
    } catch (error) {
      throw ApiError.internal("Something went wrong in db!");
    }
  }

  async updateTodo(userId: number, todoId: string) {
    try {
      const getTodoById = await prisma.todo.findUnique({
        where: {
          id: todoId,
        },
      });
      if (!getTodoById) throw ApiError.internal("Such todo isn't exist!");

      const updatedTodo = { ...getTodoById, isCompleted: !getTodoById.isCompleted };

      const updateTodo = await prisma.todo.update({
        where: {
          id: todoId,
          userId,
        },
        data: {
          ...updatedTodo,
        },
      });

      if (!updateTodo) throw ApiError.internal("Something went wrong in db when updating todo!");

      const getAllTodos = await prisma.todo.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
      return getAllTodos;
    } catch (error) {
      throw ApiError.internal("Something went wrong in db!");
    }
  }
  async deleteTodo(userId: number, todoId: string) {
    try {
      await prisma.todo.delete({
        where: {
          userId,
          id: todoId,
        },
      });

      const getAllTodos = await prisma.todo.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
      return getAllTodos;
    } catch (error) {
      throw ApiError.internal("Something went wrong in db!");
    }
  }
}

export default new TodoService();
