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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               ownerId:
 *                 type: integer
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *                 format: binary
 *             required:
 *               - name
 *               - price
 *               - ownerId
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
import { DiskFileStorage } from "../infraestructura/DiskFileStorage.js";
import { CreateProductHandler } from "./createProductHandler.js";
import { validateBody } from "../../../infraestructura/http/middleware/ValidateBody.js";
import { uploadProductImageIfMultipart } from "../../../infraestructura/http/middleware/UploadProductImage.js";
import { createProductSchema } from "./createProductSchema.js";

export function createProductRoute(
    router: Router,
    controller: CreateProductController,
) {
  router.post(
    "/",
    uploadProductImageIfMultipart,
    validateBody(createProductSchema),
    controller.execute.bind(controller),
  );
}

export function createProductRouter(): Router {
  const router = Router();
  const productRepository = new PrismaProductRepository();
  const fileStorage = new DiskFileStorage();
  const createProductHandler = new CreateProductHandler(productRepository, fileStorage);
  const createProductController = new CreateProductController(createProductHandler);
  createProductRoute(router, createProductController);
  return router;
}
