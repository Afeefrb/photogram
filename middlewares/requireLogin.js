//JWT
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config/keys");

//Mongoose
const mongoose = require("mongoose");
const User = mongoose.model("User");

//=======================================

module.exports = (req,res,next) => {
    const {authorization} = req.headers;

    //authorization === Bearer <token>

    if(!authorization) {
        return res.status(401).json({error:"You must be logged in to continue."})
    }
    const token = authorization.replace("Bearer ","");

    jwt.verify(token, JWT_SECRET, (err,payload) => { //jwt.veryfy
        if(err) {
            return res.status(401).json({error:"You must be logged in to continue."})
        }
        const {_id} = payload;
        User.findById(_id)
            .then(userData => { 
                console.log("userData:", userData);
                req.user = userData //userData: {name:"", email:"", password:"", _id:"", __v:""}
                next();
            })
    }) //jwt.veryfy
}