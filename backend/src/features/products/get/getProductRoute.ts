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
