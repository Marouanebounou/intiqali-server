import { Router } from "express";
import { Login, SignUp } from "../controllers/authController.js";

const router = Router();

router.post('/login',Login);
router.post('/register',SignUp);

export default router