import { Router } from "express";
import { createLoginRouter } from "../../features/auth/login/loginRoute.js";
import { createLogoutRouter } from "../../features/auth/logout/logoutRoute.js";
import { createRefreshTokenRouter } from "../../features/auth/refresh/refreshTokenRoute.js";
import { createUserRouter } from "../../features/users/create/createUserRoute.js";
import { createUpdateUserRouter } from "../../features/users/update/updateUserRoute.js";
import { createProductRouter } from "../../features/products/create/createProductRoute.js";
import { createGetProductRouter } from "../../features/products/get/getProductRoute.js";
import { createUpdateProductRouter } from "../../features/products/update/updateProductRoute.js";
import { createDeleteProductRouter } from "../../features/products/delete/deleteProductRoute.js";
import { createTagRouter } from "../../features/tags/create/createTagRoute.js";
import { createUpdateTagRouter } from "../../features/tags/update/updateTagRoute.js";
import { createDeleteTagRouter } from "../../features/tags/delete/deleteTagRoute.js";

const router = Router();


router.use('/auth/login',createLoginRouter());
router.use('/auth/logout',createLogoutRouter());
router.use('/auth/refresh',createRefreshTokenRouter());
router.use('/users',createUserRouter());
router.use('/users',createUpdateUserRouter());
router.use('/products',createProductRouter());
router.use('/products',createGetProductRouter());
router.use('/products',createUpdateProductRouter());
router.use('/products',createDeleteProductRouter());
router.use('/tags',createTagRouter());
router.use('/tags',createUpdateTagRouter());
router.use('/tags',createDeleteTagRouter());

export default router;
