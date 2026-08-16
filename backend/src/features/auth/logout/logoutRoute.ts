/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Cierra la sesión y revoca el token
 *     description: Revoca el access token del header Authorization o el token enviado en el body
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogoutRequest'
 *     responses:
 *       204:
 *         description: Sesión cerrada, token revocado
 *       401:
 *         description: Token requerido o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
import { Router } from "express";
import { LogoutController } from "./logoutController.js";
import { LogoutHandler } from "./logoutHandler.js";
import { JwtTokenService } from "../../../infraestructura/security/JwtTokenService.js";
import { PrismaTokenRepository } from "../infraestructura/PrismaTokenRepository.js";
import { validateBody } from "../../../infraestructura/http/middleware/ValidateBody.js";
import { logoutSchema } from "./logoutSchema.js";


function logoutRoute(
  router: Router,
  controller: LogoutController,
) {
  router.post("/",validateBody(logoutSchema),controller.execute.bind(controller));
}


export function createLogoutRouter(): Router {
  const router = Router();

  const jwtTokenService = new JwtTokenService();
  const tokenRepository = new PrismaTokenRepository();
  const logoutHandler = new LogoutHandler(
      jwtTokenService,
      tokenRepository
  );
  const logoutController = new LogoutController(logoutHandler);

  logoutRoute(router, logoutController);

  return router;
}
