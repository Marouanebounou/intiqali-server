import { Router } from "express";
import { Login, SignUp, verifyEmail } from "../controllers/authController.js";

const router = Router();

router.post('/login',Login);
router.post('/register',SignUp);
router.get('/verify/:token',verifyEmail)

export default router