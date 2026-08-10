import { Router } from "express";
import { createLoginRouter } from "../../features/auth/login/loginRoute.js";
import { createLogoutRouter } from "../../features/auth/logout/logoutRoute.js";
import { createRefreshTokenRouter } from "../../features/auth/refresh/refreshTokenRoute.js";
import { createUserRouter } from "../../features/users/create/createUserRoute.js";
import { createUpdateUserRouter } from "../../features/users/update/updateUserRoute.js";

const router = Router();


router.use('/auth/login',createLoginRouter());
router.use('/auth/logout',createLogoutRouter());
router.use('/auth/refresh',createRefreshTokenRouter());
router.use('/users',createUserRouter());
router.use('/users',createUpdateUserRouter());

export default router;
