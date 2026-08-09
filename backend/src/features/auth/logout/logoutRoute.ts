import { Router } from "express";
import { LogoutController } from "./logoutController.js";

export function logoutRoute(
  router: Router,
  controller: LogoutController,
) {
  router.post("/", controller.execute.bind(controller));
}
