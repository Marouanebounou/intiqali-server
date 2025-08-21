import Router from "express";

const route = Router();

route.post('/comment/:id',createComment)
route.put('/comment/:id',editComment)
route.delete('/comment/:id',deleteComment)
route.get('/comments/:id',getComments)


export default route