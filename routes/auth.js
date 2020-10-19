const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config/keys");
const crypto = require("crypto");



//MONGOOSE
const mongoose = require("mongoose");
const User = mongoose.model("User");


//POST: "/signup"
router.post("/signup", (req,res) => {
    const {name, password, email, pic} = req.body;
    if(!name || !password || !email) {
        return res.status(422).json({error:"Please enter all the details"})
    }
        User.findOne({email:email})
            .then((savedUser) => {
                if(savedUser) {
                    return res.status(422).json({error:"User already exists!"})
                }
                bcrypt.hash(password,12)
                    .then(hashedPassword => {
                        const user = new User({
                            name,
                            password:hashedPassword,
                            email,
                            photo:pic
                        })
                        user.save()
                            .then(user => {
                                                             
                                res.json({message:"User successfully signed up!"})
                            })
                            .catch(err => console.log(err))
                    })
               
            })
            .catch(err => console.log(err))
})


//POST: "/signin"
router.post("/signin", (req,res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(422).json({error:"Please add email or password"})
    }
    User.findOne({email:email}) 
        .then(savedUser => { //.then(savedUser)***
            if(!savedUser){
                return res.status(422).json({error:"Please sign up first."})
            }
            bcrypt.compare(password , savedUser.password) 
                .then(doMatch => {
                    if(doMatch){
                        // res.json({message:"Succesfully signed in"})
                        const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                        const {_id, name, email, following, followers, photo} = savedUser;
                        res.json({token, user:{_id, name, email,following, followers, photo}})
                    } else {
                        return res.status(422).json({error:"Inavlid email or password"})
                    }
                })
                .catch(err => console.log(err))
        }) //.then(savedUser)***
})

//POST: '/reset-password'
router.post("/reset-password", (req,res)=>{
    crypto.randomBytes(32,(err,buffer) => {
        if(err) console.log(err);
        const token = buffer.toString("hex");
        User.findOne({email:req.body.email})
            .then(user => {
                if(!user) {
                    return res.status(422).json({message:"No user found with that email"})
                }
                user.resetToken = token;
                user.expireToken = Date.now() + 3600000
                user.save()
                    .then((result) => {
                        res.json({message:"Reset Password Link Sent",token:user.resetToken})
                    })
            })
    })
})

//POST: '/new-password'
router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           user.password = hashedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save().then((saveduser)=>{
               res.json({message:"password updated success"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router;