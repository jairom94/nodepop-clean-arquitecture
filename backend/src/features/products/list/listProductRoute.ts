/**
 * @swagger
 * /products/mine:
 *   get:
 *     tags: [Products]
 *     summary: Lista los productos del usuario autenticado con paginación
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: pageSize
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Productos por página (máximo 100)
 *     responses:
 *       200:
 *         description: Listado paginado de productos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
import { Router } from "express";
import { ListProductController } from "./listProductController.js";
import { PrismaProductRepository } from "../infraestructura/PrismaProductRepository.js";
import { ListProductHandler } from "./listProductHandler.js";

export function listProductRoute(
    router: Router,
    controller: ListProductController,
) {
  router.get("/mine", controller.execute.bind(controller));
}

export function createListProductRouter(): Router {
  const router = Router();
  const productRepository = new PrismaProductRepository();
  const listProductHandler = new ListProductHandler(productRepository);
  const listProductController = new ListProductController(listProductHandler);
  listProductRoute(router, listProductController);
  return router;
}
