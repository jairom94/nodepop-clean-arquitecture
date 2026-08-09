import { Router } from "express";
import { createUserRoute } from "../../features/users/create/createUserRoute.js";
import { loginRoute } from "../../features/auth/login/loginRoute.js";

const router = Router();

// router.use(createUserRoute);
// router.use(loginRoute);

export default router;