/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Elimina un producto por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       204:
 *         description: Producto eliminado
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
import { Router } from "express";
import { DeleteProductController } from "./deleteProductController.js";
import { PrismaProductRepository } from "../infraestructura/PrismaProductRepository.js";
import { DeleteProductHandler } from "./deleteProductHandler.js";
import { DiskFileStorage } from "../infraestructura/DiskFileStorage.js";

export function deleteProductRoute(
    router: Router,
    controller: DeleteProductController,
) {
  router.delete("/:id", controller.execute.bind(controller));
}

export function createDeleteProductRouter(): Router {
  const router = Router();
  const productRepository = new PrismaProductRepository();
  const deleteProductHandler = new DeleteProductHandler(productRepository, new DiskFileStorage());
  const deleteProductController = new DeleteProductController(deleteProductHandler);
  deleteProductRoute(router, deleteProductController);
  return router;
}
