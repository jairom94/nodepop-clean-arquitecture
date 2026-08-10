import { Router } from "express";
import { CreateTagController } from "./createTagController.js";
import { PrismaTagRepository } from "../infraestructura/PrismaTagRepository.js";
import { CreateTagHandler } from "./createTagHandler.js";
import { validateBody } from "../../../infraestructura/http/middleware/ValidateBody.js";
import { createTagSchema } from "./createTagSchema.js";

export function createTagRoute(
    router: Router,
    controller: CreateTagController,
) {
  router.post("/",validateBody(createTagSchema), controller.execute.bind(controller));
}

export function createTagRouter(): Router {
  const router = Router();
  const tagRepository = new PrismaTagRepository();
  const createTagHandler = new CreateTagHandler(tagRepository);
  const createTagController = new CreateTagController(createTagHandler);
  createTagRoute(router, createTagController);
  return router;
}
