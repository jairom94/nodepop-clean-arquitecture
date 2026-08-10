import { Router } from "express";
import { DeleteTagController } from "./deleteTagController.js";
import { PrismaTagRepository } from "../infraestructura/PrismaTagRepository.js";
import { DeleteTagHandler } from "./deleteTagHandler.js";

export function deleteTagRoute(
    router: Router,
    controller: DeleteTagController,
) {
  router.delete("/:id", controller.execute.bind(controller));
}

export function createDeleteTagRouter(): Router {
  const router = Router();
  const tagRepository = new PrismaTagRepository();
  const deleteTagHandler = new DeleteTagHandler(tagRepository);
  const deleteTagController = new DeleteTagController(deleteTagHandler);
  deleteTagRoute(router, deleteTagController);
  return router;
}
