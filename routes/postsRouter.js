import Router from 'express'
import { createPost, editPost ,deletePost, userPosts } from '../controllers/postsController.js'
const router = Router()

//id of the user
router.post('/create/:id', createPost)
//id of the post
router.put('/update/:id', editPost)
//id of the post
router.delete('/delete/:id', deletePost)
//all posts in the home page
router.get('/getall', createPost)
//id of the user to fetch all user's posts
router.get('/:id', userPosts)


export default router