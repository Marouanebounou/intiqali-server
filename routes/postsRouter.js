import Router from 'express'
import { createPost, editPost ,deletePost, userPosts, getPost , gettAllPosts} from '../controllers/postsController.js'
import { postAuth } from '../middlewares/postMiddleware.js'
import { requireAuth } from '../middlewares/authMiddleware.js'
const router = Router()

//id of the user
router.post('/create',requireAuth  ,createPost)
//id of the post
router.put('/update/:id' , requireAuth, postAuth , editPost)
//id of the post
router.delete('/delete/:id', requireAuth, postAuth , deletePost)
//all posts in the home page
router.get('/', gettAllPosts)
//id of the user to fetch all user's posts
router.get('/user/:id', userPosts)
//get one post by id
router.get('/:id', getPost)

export default router