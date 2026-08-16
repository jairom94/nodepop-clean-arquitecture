/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Crea un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Error de validación de datos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: El email ya está en uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
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
