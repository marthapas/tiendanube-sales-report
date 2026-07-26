import { Router } from "express";
import passport from "passport";

import { AuthenticationController } from "@features/auth";
import OrdersController from "@features/orders/orders.controller";

const routes = Router();

routes.get("/auth/install", AuthenticationController.install);

routes.get(
  "/orders",
  passport.authenticate("jwt", { session: false }),
  OrdersController.getAll
);

export default routes;