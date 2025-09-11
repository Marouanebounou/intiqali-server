import { Router } from "express";
import { deleteUser, editPassword, editUser, getUser, Login, SignUp, verifyEmail , edit, getProfileUser} from "../controllers/authController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/login',Login);
router.post('/register',SignUp);
router.get('/user/:id' , getUser)
// id of the current user and the id of the profile user
router.get('/user/:currentUser/:profileUser', getProfileUser)
router.get('/verify/:token', verifyEmail)
router.delete('/delete/:id', deleteUser)
router.put('/update/:id/:email', editUser)
router.put("/updatePassword/:id", editPassword);
router.put('/edit/user/:id',edit)

export default router