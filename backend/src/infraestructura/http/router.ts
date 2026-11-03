import { Router } from "express";
import { createLoginRouter } from "../../features/auth/login/loginRoute.js";
import { createLogoutRouter } from "../../features/auth/logout/logoutRoute.js";
import { createRefreshTokenRouter } from "../../features/auth/refresh/refreshTokenRoute.js";
import { createUserRouter } from "../../features/users/create/createUserRoute.js";
import { createUpdateUserRouter } from "../../features/users/update/updateUserRoute.js";
import { createProductRouter } from "../../features/products/create/createProductRoute.js";
import { createListProductRouter } from "../../features/products/list/listProductRoute.js";
import { createGetProductRouter } from "../../features/products/get/getProductRoute.js";
import { createUpdateProductRouter } from "../../features/products/update/updateProductRoute.js";
import { createUploadProductImageRouter } from "../../features/products/upload-image/uploadProductImageRoute.js";
import { createDeleteProductRouter } from "../../features/products/delete/deleteProductRoute.js";
import { createTagRouter } from "../../features/tags/create/createTagRoute.js";
import { createListTagRouter } from "../../features/tags/list/listTagRoute.js";
import { createUpdateTagRouter } from "../../features/tags/update/updateTagRoute.js";
import { createDeleteTagRouter } from "../../features/tags/delete/deleteTagRoute.js";
import { authGuard } from "./middleware/AuthGuard.js";
import { rateLimitPresets } from "./middleware/RateLimit.js";
import { vault } from "./middleware/Vault.js";
import { ENVIRONMENTS } from "../../config/environments.js";
import { JwtTokenService } from "../security/JwtTokenService.js";
import { PrismaTokenRepository } from "../../features/auth/infraestructura/PrismaTokenRepository.js";

const router = Router();

// Modo demo (DEMO_MODE=true): solo lectura.
// Pasan las lecturas y lo imprescindible para la sesión; registro y escrituras se cortan.
// Va antes que todo: no consume rate limit ni carga subidas de imágenes en memoria.
const READ_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const DEMO_SESSION_ROUTES = new Set(["/auth/login", "/auth/refresh", "/auth/logout"]);

router.use(
  vault({
    enabled: ENVIRONMENTS.demoMode,
    message: "Esta demo es de solo lectura: no se pueden crear, editar ni borrar datos",
    allow: (req) =>
      READ_METHODS.has(req.method) || DEMO_SESSION_ROUTES.has(req.path.replace(/\/+$/, "")),
  }),
);


// Rutas publicas
// Rate limit estricto en login para mitigar ataques de fuerza bruta
router.use('/auth/login', rateLimitPresets.login(), createLoginRouter());
router.use('/auth/refresh', rateLimitPresets.refresh(), createRefreshTokenRouter());
// Solo el alta (POST) es pública; la edición de usuario pasa por el limitador global
const registerLimiter = rateLimitPresets.register();
router.use('/users', (req, res, next) => (req.method === "POST" ? registerLimiter(req, res, next) : next()), createUserRouter());

// Rutas protegidas
// Rate limit global para todas las rutas autenticadas
router.use(rateLimitPresets.global());
router.use(authGuard(new JwtTokenService(), new PrismaTokenRepository()));

router.use('/auth/logout',createLogoutRouter());
router.use('/users',createUpdateUserRouter());
router.use('/products',createProductRouter());
router.use('/products',createListProductRouter());
router.use('/products',createGetProductRouter());
router.use('/products',createUpdateProductRouter());
router.use('/products',createUploadProductImageRouter());
router.use('/products',createDeleteProductRouter());
router.use('/tags',createTagRouter());
router.use('/tags',createListTagRouter());
router.use('/tags',createUpdateTagRouter());
router.use('/tags',createDeleteTagRouter());

export default router;
