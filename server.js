import express from 'express'
import connectDB from './config/db.js'
import authRouter from './routes/authRouter.js'
import finishProfileRouter from './routes/finishProfileRouter.js'
import postsRouter from './routes/postsRouter.js'
const app = express()
app.use(express.json())
const PORT = process.env.PORT || 5000


app.use('/api/auth',authRouter)
app.use('/api/complete',finishProfileRouter)
app.use('/api/posts' , postsRouter)



connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
})
