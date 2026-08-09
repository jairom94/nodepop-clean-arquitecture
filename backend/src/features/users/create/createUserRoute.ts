import { Router } from "express";
import { CreateUserController } from "./createUserController.js";

export function createUserRoute(
    router: Router, 
    controller: CreateUserController
) {
  router.post("/users", controller.execute.bind(controller));
}
