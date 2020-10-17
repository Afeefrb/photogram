const express = require("express");
const router = express.Router();
const requireLogin = require("../middlewares/requireLogin");

//MONGOOSE
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("User");


//GET: "/profile/:userId"
router.get("/profile/:userId", requireLogin,(req,res) => {
    User.findOne({_id:req.params.userId})
    .select("-password")
    .then(user => {
        Post.find({postedBy:req.params.userId})
        .populate("postedBy","_id name")
        .exec((err,posts) => {
            if(err) return res.status(422).json({error: err})
            else {
                res.json({user,posts})
            }
        })
    })
    .catch(err => console.log(err))
})


//PUT "/follow"
//followId => Other user
router.put("/follow", requireLogin, (req,res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err) return res.status(422).json({error:err})
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{
            new: true
        })
        .select("-password")
        .then(result => res.json(result))
        .catch(err => {return res.status(422).json({error:err})})
    })
})


//PUT "/unfollow"
//unfollowId => Other user
router.put("/unfollow", requireLogin, (req,res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err) return res.status(422).json({error:err})
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{
            new: true
        })
        .select("-password")
        .then(result => res.json(result))
        .catch(err => {return res.status(422).json({error:err})})
    })
})

//update profile pic
router.put("/uploadpic", requireLogin, (req,res) => {
    User.findByIdAndUpdate(req.user._id, {
        $set:{photo:req.body.photo}
    },{},(err,result) => {
        if(err) return res.status(422).json({error:err});
        console.log(result);
        res.json(result)
    })
})




module.exports = router;