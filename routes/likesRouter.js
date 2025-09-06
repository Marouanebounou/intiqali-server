import Router from "express";

import { likePost, unlikePost, getLikes } from "../controllers/likeController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const route = Router();

route.post('/like/:id/:user' ,likePost)

route.post('/unlike/:id', requireAuth ,unlikePost)

route.get('/likes/:id' ,getLikes)

export default route