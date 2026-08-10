import { Router } from "express";
import { UpdateUserController } from "./updateUserController.js";
import { PrismaUserRepository } from "../infraestructura/PrismaUserRepository.js";
import { UpdateUserHandler } from "./updateUserHandler.js";
import { validateBody } from "../../../infraestructura/http/middleware/ValidateBody.js";
import { updateUserSchema } from "./updateUserSchema.js";

export function updateUserRoute(
    router: Router, 
    controller: UpdateUserController
) {
  router.patch("/:id",validateBody(updateUserSchema), controller.execute.bind(controller));
}


export function createUpdateUserRouter(): Router {
  const router = Router();
  const userRepository = new PrismaUserRepository();
  const updateUserHandler = new UpdateUserHandler(userRepository);
  const updateUserController = new UpdateUserController(updateUserHandler);
  updateUserRoute(router,updateUserController);
  return router;
}
