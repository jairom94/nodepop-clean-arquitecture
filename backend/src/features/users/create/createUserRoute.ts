import { Router } from "express";
import { CreateUserController } from "./createUserController.js";
import { PrismaUserRepository } from "../infraestructura/PrismaUserRepository.js";
import { CreateUserHandler } from "./createUserHandler.js";
import { BcryptPasswordHasher } from "../../../infraestructura/security/BcryptPasswordHasher.js";
import { validateBody } from "../../../infraestructura/http/middleware/ValidateBody.js";
import { createUserSchema } from "./createUserSchema.js";

export function createUserRoute(
    router: Router, 
    controller: CreateUserController
) {
  router.post("/",validateBody(createUserSchema), controller.execute.bind(controller));
}


export function createUserRouter(): Router {
  const router = Router();
  const userRepository = new PrismaUserRepository();
  const passwordHasher = new BcryptPasswordHasher();
  const createUserHandler = new CreateUserHandler(
    userRepository,
    passwordHasher
  );
  const createUserController = new CreateUserController(createUserHandler);
  createUserRoute(router,createUserController);
  return router;
}
