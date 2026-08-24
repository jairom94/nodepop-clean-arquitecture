/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Renueva el access token usando el refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: Nuevo access token generado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshTokenResponse'
 *       401:
 *         description: Refresh token inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
import { Router } from "express";
import { RefreshTokenController } from "./refreshTokenController.js";
import { RefreshTokenHandler } from "./refreshTokenHandler.js";
import { JwtTokenService } from "../../../infraestructura/security/JwtTokenService.js";
import { PrismaTokenRepository } from "../infraestructura/PrismaTokenRepository.js";
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
  const tokenRepository = new PrismaTokenRepository();
  const refreshTokenHandler = new RefreshTokenHandler(
      jwtTokenService,
      tokenRepository
  );
  const refreshTokenController = new RefreshTokenController(refreshTokenHandler);

  refreshTokenRoute(router, refreshTokenController);

  return router;
}
