import Router from "express";
import { createComment, editComment } from "../controllers/commentsController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const route = Router();

route.post('/create/:id',requireAuth, createComment)
route.put('/edit/:id',editComment)
// route.delete('/comment/:id',deleteComment)
// route.get('/comments/:id',getComments)


export default route