import { NextFunction, Request, Response } from "express";
import { StatusCode } from "@utils";
import OrdersService from "./orders.service";

class OrdersController {
  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = (req.user as { user_id: number }).user_id;
      const data = await OrdersService.findAll(userId);

      return res.status(StatusCode.OK).json(data);
    } catch (e) {
      next(e);
    }
  }
}

export default new OrdersController();