const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./routes/authRouter')
const PORT = process.env.PORT || 4000

const app = express()

app.use(express.json())
app.use("/auth", authRouter)

const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://root:root@cluster0.iyw07xh.mongodb.net/?retryWrites=true&w=majority`).then(console.log("database connection"))
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (error) {
        console.log(error)
    }
}

start()