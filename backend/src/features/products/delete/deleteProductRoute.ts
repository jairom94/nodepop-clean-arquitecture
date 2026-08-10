import { Router } from "express";
import { DeleteProductController } from "./deleteProductController.js";
import { PrismaProductRepository } from "../infraestructura/PrismaProductRepository.js";
import { DeleteProductHandler } from "./deleteProductHandler.js";

export function deleteProductRoute(
    router: Router,
    controller: DeleteProductController,
) {
  router.delete("/:id", controller.execute.bind(controller));
}

export function createDeleteProductRouter(): Router {
  const router = Router();
  const productRepository = new PrismaProductRepository();
  const deleteProductHandler = new DeleteProductHandler(productRepository);
  const deleteProductController = new DeleteProductController(deleteProductHandler);
  deleteProductRoute(router, deleteProductController);
  return router;
}
