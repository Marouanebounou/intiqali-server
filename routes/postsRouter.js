import Router from 'express'
import { createPost, editPost ,deletePost, userPosts, getPost , gettAllPosts, like} from '../controllers/postsController.js'
import { postAuth } from '../middlewares/postMiddleware.js'
import { requireAuth } from '../middlewares/authMiddleware.js'
import uploade from '../config/uploade.js'
const router = Router()

//id of the user
router.post('/create/:id',uploade.single('img')  ,createPost)
//id of the post
router.put('/update/:id' , postAuth , editPost)
//id of the post
router.delete('/delete/:id' , deletePost)
// like post
router.post('/like/:id', requireAuth, like)
//all posts in the home page
router.get('/', gettAllPosts)
//id of the user to fetch all user's posts
router.get('/user/:id', userPosts)
//get one post by id
router.get('/:id', getPost)


export default router