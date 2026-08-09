import { Router } from "express";
import { RefreshTokenController } from "./refreshTokenController.js";

export function refreshTokenRoute(
  router: Router,
  controller: RefreshTokenController,
) {
  router.post("/", controller.execute.bind(controller));
}
