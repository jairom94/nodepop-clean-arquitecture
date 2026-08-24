/**
 * @swagger
 * /products/{id}/image:
 *   post:
 *     tags: [Products]
 *     summary: Sube una imagen para un producto
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *             required:
 *               - image
 *     responses:
 *       200:
 *         description: Imagen subida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: No se envió archivo o el tipo no es válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
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
import { UploadProductImageController } from "./uploadProductImageController.js";
import { PrismaProductRepository } from "../infraestructura/PrismaProductRepository.js";
import { UploadProductImageHandler } from "./uploadProductImageHandler.js";
import { DiskFileStorage } from "../infraestructura/DiskFileStorage.js";
import { uploadProductImage } from "../../../infraestructura/http/middleware/UploadProductImage.js";

export function uploadProductImageRoute(
  router: Router,
  controller: UploadProductImageController,
) {
  router.post(
    "/:id/image",
    uploadProductImage,
    controller.execute.bind(controller),
  );
}

export function createUploadProductImageRouter(): Router {
  const router = Router();
  const productRepository = new PrismaProductRepository();
  const fileStorage = new DiskFileStorage();
  const uploadProductImageHandler = new UploadProductImageHandler(
    productRepository,
    fileStorage,
  );
  const uploadProductImageController = new UploadProductImageController(
    uploadProductImageHandler,
  );
  uploadProductImageRoute(router, uploadProductImageController);
  return router;
}
