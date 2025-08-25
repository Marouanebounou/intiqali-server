import { Router } from "express";
import { deleteUser, getUser, Login, SignUp, verifyEmail } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/login',Login);
router.post('/register',SignUp);
router.get('/user' ,requireAuth, getUser)
router.get('/verify/:token', verifyEmail)
router.delete('/delete', requireAuth, deleteUser)

export default router