import { Request, Response } from "express";
import todoService from "../../services/todo.service";
class TodoController {
  async getTodos(req: Request, res: Response) {
    return await todoService.getTodos();
  }

  async addTodo(req: Request, res: Response) {
    return await todoService.createTodo(req.user.id, req.body);
  }

  async deleteTodo(req: Request, res: Response) {
    return await todoService.deleteTodo(req.user.id, req.params.id);
  }

  async updateTodo(req: Request, res: Response) {
    return await todoService.updateTodo(req.user.id, req.params.id);
  }
}

export default new TodoController();
