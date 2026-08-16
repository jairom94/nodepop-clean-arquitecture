/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     tags: [Tags]
 *     summary: Elimina un tag por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tag
 *     responses:
 *       204:
 *         description: Tag eliminado
 *       401:
 *         description: No autenticado
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
 */
import { Router } from "express";
import { DeleteTagController } from "./deleteTagController.js";
import { PrismaTagRepository } from "../infraestructura/PrismaTagRepository.js";
import { DeleteTagHandler } from "./deleteTagHandler.js";

export function deleteTagRoute(
    router: Router,
    controller: DeleteTagController,
) {
  router.delete("/:id", controller.execute.bind(controller));
}

export function createDeleteTagRouter(): Router {
  const router = Router();
  const tagRepository = new PrismaTagRepository();
  const deleteTagHandler = new DeleteTagHandler(tagRepository);
  const deleteTagController = new DeleteTagController(deleteTagHandler);
  deleteTagRoute(router, deleteTagController);
  return router;
}
