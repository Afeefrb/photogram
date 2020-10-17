const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config/keys");
const requireLogin = require("../middlewares/requireLogin");

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

module.exports = router;