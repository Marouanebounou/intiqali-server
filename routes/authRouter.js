import { Router } from "express";
import { deleteUser, editPassword, editUser, getUser, Login, SignUp, verifyEmail } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/login',Login);
router.post('/register',SignUp);
router.get('/user/:id' , getUser)
router.get('/verify/:token', verifyEmail)
router.delete('/delete/:id', requireAuth, deleteUser)
router.put('/update/:id/:email', editUser)
router.put("/updatePassword/:id", editPassword);

export default router