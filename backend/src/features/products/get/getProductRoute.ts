/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: Lista todos los productos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado completo de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Obtiene un producto por su ID
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
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
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
import { GetProductController } from "./getProductController.js";
import { PrismaProductRepository } from "../infraestructura/PrismaProductRepository.js";
import { GetProductHandler } from "./getProductHandler.js";

export function getProductRoute(
    router: Router,
    controller: GetProductController,
) {
  router.get("/", controller.execute.bind(controller));
  router.get("/:id", controller.execute.bind(controller));
}

export function createGetProductRouter(): Router {
  const router = Router();
  const productRepository = new PrismaProductRepository();
  const getProductHandler = new GetProductHandler(productRepository);
  const getProductController = new GetProductController(getProductHandler);
  getProductRoute(router, getProductController);
  return router;
}
