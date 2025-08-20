import express from 'express'
import connectDB from './config/db.js'
import authRouter from './routes/authRouter.js'

const app = express()
app.use(express.json())
const PORT = process.env.PORT || 5000


app.use('/api/auth',authRouter)


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
})
