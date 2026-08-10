import { Router } from "express";
import { createLoginRouter } from "../../features/auth/login/loginRoute.js";

const router = Router();


router.use('/auth/login',createLoginRouter());

export default router;