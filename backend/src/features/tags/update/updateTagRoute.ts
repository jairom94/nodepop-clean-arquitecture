import { Router } from "express";
import { UpdateTagController } from "./updateTagController.js";
import { PrismaTagRepository } from "../infraestructura/PrismaTagRepository.js";
import { UpdateTagHandler } from "./updateTagHandler.js";
import { validateBody } from "../../../infraestructura/http/middleware/ValidateBody.js";
import { updateTagSchema } from "./updateTagSchema.js";

export function updateTagRoute(
    router: Router,
    controller: UpdateTagController,
) {
  router.patch("/:id",validateBody(updateTagSchema), controller.execute.bind(controller));
}

export function createUpdateTagRouter(): Router {
  const router = Router();
  const tagRepository = new PrismaTagRepository();
  const updateTagHandler = new UpdateTagHandler(tagRepository);
  const updateTagController = new UpdateTagController(updateTagHandler);
  updateTagRoute(router, updateTagController);
  return router;
}
