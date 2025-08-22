import Router from "express";
import { createComment, deleteComment, editComment, getComment } from "../controllers/commentsController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const route = Router();

route.post('/create/:id',requireAuth, createComment)
route.put('/edit/:id',  requireAuth ,editComment)
route.delete('/delete/:id',requireAuth, deleteComment)
// post id 
route.get('/get/:id',getComment)


export default route