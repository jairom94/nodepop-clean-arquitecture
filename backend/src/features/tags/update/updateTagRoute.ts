/**
 * @swagger
 * /tags/{id}:
 *   patch:
 *     tags: [Tags]
 *     summary: Actualiza el nombre de un tag
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTagRequest'
 *     responses:
 *       200:
 *         description: Tag actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       401:
 *         description: No autenticado o error de validación de datos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Tag no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Ya existe un tag con ese nombre
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
import { Router } from "express";
import { UpdateTagController } from "./updateTagController.js";
import { PrismaTagRepository } from "../infraestructura/PrismaTagRepository.js";
import { UpdateTagHandler } from "./updateTagHandler.js";
import { validateBody } from "../../../infraestructura/http/middleware/ValidateBody.js";
import { updateTagSchema } from "./updateTagSchema.js";

export function updateTagRoute(
    router: Router,
    controller: UpdateTagController,
) {
  router.patch("/:id",validateBody(updateTagSchema), controller.execute.bind(controller));
}

export function createUpdateTagRouter(): Router {
  const router = Router();
  const tagRepository = new PrismaTagRepository();
  const updateTagHandler = new UpdateTagHandler(tagRepository);
  const updateTagController = new UpdateTagController(updateTagHandler);
  updateTagRoute(router, updateTagController);
  return router;
}
