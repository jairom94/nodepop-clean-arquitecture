/**
 * @swagger
 * /tags:
 *   get:
 *     tags: [Tags]
 *     summary: Lista todos los tags
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado completo de tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
import { Router } from "express";
import { ListTagController } from "./listTagController.js";
import { PrismaTagRepository } from "../infraestructura/PrismaTagRepository.js";
import { ListTagHandler } from "./listTagHandler.js";

export function listTagRoute(
    router: Router,
    controller: ListTagController,
) {
  router.get("/", controller.execute.bind(controller));
}

export function createListTagRouter(): Router {
  const router = Router();
  const tagRepository = new PrismaTagRepository();
  const listTagHandler = new ListTagHandler(tagRepository);
  const listTagController = new ListTagController(listTagHandler);
  listTagRoute(router, listTagController);
  return router;
}
