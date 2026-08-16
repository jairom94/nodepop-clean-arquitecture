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
