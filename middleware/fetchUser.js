
var jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();
const jwt_secret=process.env.JWT_SECRET

const fetchUser=(req,res,next)=>{
    let {authToken} = req.body;
    if (!authToken) {
        res.status(401).send({ e: "Token Not Found" })
        next()
    } else {
        try{
            let dataJWT=jwt.verify(authToken,jwt_secret,(err,decode)=>{
               if(err){
                res.json({e:"Token Expired"});
               } else {
                req.user = decode
                next()
               }
            })
        }
        catch{
            res.send({ e: "Not A Valid Token" })
        }
    }
    
}

module.exports = fetchUser;