// app.js
const express = require('express');
const db_functions = require('./controllers/db_functions');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path');
const SendNotification = require('./firebase/sendNotification');


app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(cors())

app.use("/api/auth", require("./routes/auth"))
app.use("/api/category", require("./routes/category"))
app.use("/api/product", require("./routes/product"))
app.use("/api/cart", require("./routes/cart"))
app.use("/api/order", require("./routes/order"))
app.use("/api/review", require("./routes/product_review"))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/test", (req, res) => {
    // SendNotification({
    //     notification: {
    //         title: 'Hello World',
    //         body: 'This is a app notification',
    //     },
    //     token: 'exzIl8MLRGq4cwMvjfgpsI:APA91bFdBeMxPJnIsUmltyw0OAYTINac18oExsblN6YoRBNe8OFccCZLrlPuuB0KX3HzboZilXLpPF9XK2OZS1Wq4ayU7j8V7JEm-vVk_g56pVPl_yoTSfrZpLcR-t3sq6pFIHNq0R80',
    // })
    console.log("test")
    res.send({ "msg": "hello world12345" })
})

module.exports = app;
