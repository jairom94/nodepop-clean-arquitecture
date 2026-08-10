import { Router } from "express";
import { RefreshTokenController } from "./refreshTokenController.js";
import { RefreshTokenHandler } from "./refreshTokenHandler.js";
import { JwtTokenService } from "../../../infraestructura/security/JwtTokenService.js";
import { validateBody } from "../../../infraestructura/http/middleware/ValidateBody.js";
import { refreshTokenSchema } from "./refreshTokenSchema.js";


function refreshTokenRoute(
  router: Router,
  controller: RefreshTokenController,
) {
  router.post("/",validateBody(refreshTokenSchema),controller.execute.bind(controller));
}


export function createRefreshTokenRouter(): Router {
  const router = Router();

  const jwtTokenService = new JwtTokenService();
  const refreshTokenHandler = new RefreshTokenHandler(
      jwtTokenService
  );
  const refreshTokenController = new RefreshTokenController(refreshTokenHandler);

  refreshTokenRoute(router, refreshTokenController);

  return router;
}
