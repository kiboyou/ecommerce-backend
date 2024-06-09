const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const authRoute = require("../routes/Auth")
const userRoute = require("../routes/userRoute")
const productRoute = require("../routes/productRoute")
const orderRoute = require("../routes/orderRoute")
const CartRoute = require("../routes/CartRoute")
const stripeRoute = require("../routes/stripe");
const cors = require("cors");

dotenv.config()
const app = express()
app.use(cors());
app.use(express.json()) //très utile pour manipuler les données en json


mongoose.connect(process.env.DB_CONNECT)
    .then(() => console.log('DB connection'))
    .catch((err) => console.log(err))

app.listen(process.env.PORT, (req, res) => {
    console.log(`server is running on port ${process.env.PORT}`)
});

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute)
app.use("/api/product", productRoute)
app.use("/api/orders", orderRoute)
app.use("/api/cart", CartRoute)
app.use("/api/checkout", stripeRoute);