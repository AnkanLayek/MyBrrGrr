const express = require('express')
const http = require('http')
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()

const adminRouter = require("./routes/admin.routes")
const userRouter = require("./routes/user.routes")
const loginRouter = require("./routes/login.routes")
const visitorDetailsRouter = require("./routes/visitorDetails.routes")
const itemRouter = require("./routes/item.routes")
const ingredientRouter = require("./routes/ingredient.routes")
const orderRouter = require("./routes/order.routes")
const razorpayRouter = require("./routes/razorpay.routes")
const dbConnection = require("./configs/mongooseConnection")

const port = process.env.PORT
const frontendUrl = process.env.FRONTEND_URL

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use(
    cors({
        origin: [
            frontendUrl
        ],
        methods: ['GET', 'POST', 'DELETE'],
        credentials: true
    })
)

app.get("/", (req, res) => {
    res.send("Server is running ...")
})

app.use("/admin", adminRouter)
app.use("/user", userRouter)
app.use("/log", loginRouter)
app.use("/visitorDetails", visitorDetailsRouter)
app.use("/item", itemRouter)
app.use("/ingredient", ingredientRouter)
app.use("/order", orderRouter)
app.use("/razorpay", razorpayRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})