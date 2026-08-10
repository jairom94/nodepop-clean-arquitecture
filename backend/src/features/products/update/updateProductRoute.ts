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
