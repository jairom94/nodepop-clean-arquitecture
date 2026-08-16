/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Inicia sesión con email y password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login correcto. Devuelve el access token y el refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
import { Router } from "express";
import { LoginController } from "./loginController.js";
import { PrismaUserRepository } from "../../users/infraestructura/PrismaUserRepository.js";
import { BcryptPasswordHasher } from "../../../infraestructura/security/BcryptPasswordHasher.js";
import { JwtTokenService } from "../../../infraestructura/security/JwtTokenService.js";
import { LoginHandler } from "./loginHandler.js";
import { validateBody } from "../../../infraestructura/http/middleware/ValidateBody.js";
import { loginSchema } from "./loginSchema.js";


function loginRoute(
  router: Router,
  controller: LoginController,
) {
  router.post("/",validateBody(loginSchema),controller.execute.bind(controller));
}


export function createLoginRouter(): Router {
  const router = Router();

  const userRepository = new PrismaUserRepository();
  const passwordHasher = new BcryptPasswordHasher();
  const jwtTokenService = new JwtTokenService();
  const loginHandler = new LoginHandler(
      userRepository,
      passwordHasher,
      jwtTokenService
  );
  const loginController = new LoginController(loginHandler);

  loginRoute(router, loginController);

  return router;
}
