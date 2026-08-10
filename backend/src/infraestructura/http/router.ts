import { Router } from "express";
import { createLoginRouter } from "../../features/auth/login/loginRoute.js";
import { createLogoutRouter } from "../../features/auth/logout/logoutRoute.js";
import { createRefreshTokenRouter } from "../../features/auth/refresh/refreshTokenRoute.js";
import { createUserRouter } from "../../features/users/create/createUserRoute.js";

const router = Router();


router.use('/auth/login',createLoginRouter());
router.use('/auth/logout',createLogoutRouter());
router.use('/auth/refresh',createRefreshTokenRouter());
router.use('/users',createUserRouter());

export default router;
