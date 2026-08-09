import { Router } from "express";
import { LoginController } from "./loginController.js";


export function loginRoute(
  router: Router,
  controller: LoginController,
) {
  router.post("/", controller.execute.bind(controller));
}

