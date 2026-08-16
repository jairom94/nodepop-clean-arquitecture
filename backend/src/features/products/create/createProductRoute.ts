/**
 * @swagger
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Crea un nuevo producto
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *     responses:
 *       201:
 *         description: Producto creado correctamente
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
 */
import { Router } from "express";
import { CreateProductController } from "./createProductController.js";
import { PrismaProductRepository } from "../infraestructura/PrismaProductRepository.js";
import { CreateProductHandler } from "./createProductHandler.js";
import { validateBody } from "../../../infraestructura/http/middleware/ValidateBody.js";
import { createProductSchema } from "./createProductSchema.js";

export function createProductRoute(
    router: Router,
    controller: CreateProductController,
) {
  router.post("/",validateBody(createProductSchema), controller.execute.bind(controller));
}

export function createProductRouter(): Router {
  const router = Router();
  const productRepository = new PrismaProductRepository();
  const createProductHandler = new CreateProductHandler(productRepository);
  const createProductController = new CreateProductController(createProductHandler);
  createProductRoute(router, createProductController);
  return router;
}
