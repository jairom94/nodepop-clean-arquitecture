/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     tags: [Products]
 *     summary: Actualiza parcialmente un producto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductRequest'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: No autenticado o error de validación de datos
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
import { UpdateProductController } from "./updateProductController.js";
import { PrismaProductRepository } from "../infraestructura/PrismaProductRepository.js";
import { UpdateProductHandler } from "./updateProductHandler.js";
import { validateBody } from "../../../infraestructura/http/middleware/ValidateBody.js";
import { updateProductSchema } from "./updateProductSchema.js";

export function updateProductRoute(
    router: Router,
    controller: UpdateProductController,
) {
  router.patch("/:id",validateBody(updateProductSchema), controller.execute.bind(controller));
}

export function createUpdateProductRouter(): Router {
  const router = Router();
  const productRepository = new PrismaProductRepository();
  const updateProductHandler = new UpdateProductHandler(productRepository);
  const updateProductController = new UpdateProductController(updateProductHandler);
  updateProductRoute(router, updateProductController);
  return router;
}
