/**
 * @swagger
 * /tags:
 *   post:
 *     tags: [Tags]
 *     summary: Crea un nuevo tag
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTagRequest'
 *     responses:
 *       201:
 *         description: Tag creado correctamente
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
 *       409:
 *         description: Ya existe un tag con ese nombre
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
import { Router } from "express";
import { CreateTagController } from "./createTagController.js";
import { PrismaTagRepository } from "../infraestructura/PrismaTagRepository.js";
import { CreateTagHandler } from "./createTagHandler.js";
import { validateBody } from "../../../infraestructura/http/middleware/ValidateBody.js";
import { createTagSchema } from "./createTagSchema.js";

export function createTagRoute(
    router: Router,
    controller: CreateTagController,
) {
  router.post("/",validateBody(createTagSchema), controller.execute.bind(controller));
}

export function createTagRouter(): Router {
  const router = Router();
  const tagRepository = new PrismaTagRepository();
  const createTagHandler = new CreateTagHandler(tagRepository);
  const createTagController = new CreateTagController(createTagHandler);
  createTagRoute(router, createTagController);
  return router;
}
