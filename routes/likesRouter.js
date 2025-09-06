import Router from "express";

import { getLikes, getUserLikes, likePost, unlikePost } from "../controllers/likeController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const route = Router();

route.post('/like/:id/:user' ,likePost)

route.post('/unlike/:id', requireAuth ,unlikePost)

route.get('/likes/:id', getLikes);

route.get('/likes/user/:userId', getUserLikes);

export default route