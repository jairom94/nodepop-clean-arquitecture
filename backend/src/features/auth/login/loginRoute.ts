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
