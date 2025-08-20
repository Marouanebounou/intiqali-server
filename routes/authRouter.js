import { Router } from "express";
import { deleteUser, Login, SignUp, verifyEmail } from "../controllers/authController.js";

const router = Router();

router.post('/login',Login);
router.post('/register',SignUp);
router.get('/verify/:token',verifyEmail)
router.delete('/delete/:id',deleteUser)

export default router