/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Actualiza los datos de perfil de un usuario (no permite cambiar la password)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autenticado o error de validación de datos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: El email ya está en uso por otro usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
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
