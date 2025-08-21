import Router from "express";

import { likePost, unlikePost, getLikes } from "../controllers/likeController.js";

const route = Router();

route.post('/like/:id',likePost)

route.post('/unlike/:id',unlikePost)

route.get('/likes/:id',getLikes)

export default route