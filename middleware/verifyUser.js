
var jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();
const jwt_secret = process.env.JWT_SECRET

const fetchUser = (req, res, next) => {
    let { authorization } = req.headers;
    if (!authorization) {
        res.status(401).send({ e: "Token Not Found" })
    } else {
        try {
            let dataJWT = jwt.verify(authorization, jwt_secret, (err, decode) => {
                if (err) {
                    res.status(401).json({ e: "Invalid Token" });
                } else {
                    let userDetails = new User(decode)
                    userDetails.getUserById().then((response) => {
                        req.user = response;
                        next()
                    })
                }
            })
        }
        catch (e) {
            res.send({ e: "Internal Server Error" })
        }
    }

}

module.exports = fetchUser;