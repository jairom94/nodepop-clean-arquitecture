import express, { NextFunction, Request, Response, Router } from "express";
import logger from "morgan";
import { ErrorCodes } from "./shared/errors/error-codes.js";
import { AppError } from "./shared/errors/AppError.js";
import { loginRoute } from "./features/auth/login/loginRoute.js";
import { logoutRoute } from "./features/auth/logout/logoutRoute.js";
import { refreshTokenRoute } from "./features/auth/refresh/refreshTokenRoute.js";
import { LoginController } from "./features/auth/login/loginController.js";
import { LoginHandler } from "./features/auth/login/loginHandler.js";
import { LogoutController } from "./features/auth/logout/logoutController.js";
import { LogoutHandler } from "./features/auth/logout/logoutHandler.js";
import { RefreshTokenController } from "./features/auth/refresh/refreshTokenController.js";
import { RefreshTokenHandler } from "./features/auth/refresh/refreshTokenHandler.js";
import { PrismaUserRepository } from "./features/users/infraestructura/PrismaUserRepository.js";
import { PrismaTokenRepository } from "./features/auth/infraestructura/PrismaTokenRepository.js";
import { BcryptPasswordHasher } from "./infraestructura/security/BcryptPasswordHasher.js";
import { JwtTokenService } from "./infraestructura/security/JwtTokenService.js";

const app = express();

app.use(express.json());

app.use(logger("dev"));

const apiVersion = "/api/v1";

const userRepository = new PrismaUserRepository();
const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService();

const loginRouter = Router();
loginRoute(
  loginRouter,
  new LoginController(new LoginHandler(userRepository, passwordHasher, tokenService))
);
app.use(`${apiVersion}/auth/login`, loginRouter);

const logoutRouter = Router();
logoutRoute(
  logoutRouter,
  new LogoutController(new LogoutHandler(tokenService, new PrismaTokenRepository()))
);
app.use(`${apiVersion}/auth/logout`, logoutRouter);

const refreshTokenRouter = Router();
refreshTokenRoute(
  refreshTokenRouter,
  new RefreshTokenController(new RefreshTokenHandler(tokenService))
);
app.use(`${apiVersion}/auth/refresh`, refreshTokenRouter);

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente.");
});

//404
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send({
    error: "Not Found",
    message: `Path ${req.originalUrl} not found`,
  });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {    
    return res.status(err.status).json({
      code: err.code,
      message: err.message,
      stack: err.stack,
    });
  }

  const error = err instanceof Error ? err : new Error("Unknown error");
  return res.status(500).json({
    code: ErrorCodes.INTERNAL_ERROR,
    message: "Internal server error",
    stack: error.stack,
  });
});

export default app;
