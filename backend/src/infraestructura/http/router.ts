import { Router } from "express";
import { createLoginRouter } from "../../features/auth/login/loginRoute.js";
import { createUserRouter } from "../../features/users/create/createUserRoute.js";

const router = Router();


router.use('/auth/login',createLoginRouter());
router.use('/users',createUserRouter());

export default router;