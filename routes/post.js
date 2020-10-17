const express = require("express");
const router = express.Router();
const requireLogin = require("../middlewares/requireLogin");

//MONGOOSE
const mongoose = require("mongoose");
const Post = mongoose.model("Post");

//GET: "/allposts"
router.get("/allposts", (req,res) => {
    Post.find()
        .populate("postedBy", "_id name photo")
        .populate("comments.postedBy", "_id name photo")
        .then(posts => {
            res.json({posts})
        })
        .catch(err => console.log(err))
})

//GET: "/followingFeed"
router.get("/followingFeed", requireLogin, (req,res) => {
    Post.find({postedBy:{$in:req.user.following}})
        .populate("postedBy", "_id name photo")
        .populate("comments.postedBy", "_id name photo")
        .then(posts => {
            res.json({posts})
        })
        .catch(err => console.log(err))
})


//POST: "/createpost"
router.post("/createpost", requireLogin, (req,res) => {
    const {title, body, pic} = req.body;
    if(!title || !body || !pic) {
        return res.status(422).json({error:"Please enter all the fields."})
    }
    // req.user.password = null;
    const post = new Post({
        title,
        body,
        photo:pic,    
        postedBy: req.user
    })
    
    post.save()
        .then(createdPost => res.json({post:createdPost}))
        .catch(err => console.log(err))
})

//GET:"/myposts"
router.get("/myposts", requireLogin, (req,res) => {
    Post.find({postedBy:req.user._id})
        .populate("postedBy","_id name photo")
        .then(myposts => res.json({myposts}))
        .catch(err => console.log(err))
})

//PUT: "/likes"
router.put("/like", requireLogin, (req,res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{likes: req.user._id}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name photo")
    .populate("postedBy", "_id name photo")
    .exec((err,result) => {
        if(err) {
            return res.status(422).json({error: err})
        } else {
            res.json(result)
        }
    })
})

//PUT: "/unlike"
router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name photo")
    .populate("postedBy", "_id name photo")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

//PUT: "/comment"
router.put("/comment", requireLogin, (req,res) => {
    const comment = {
        text: req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{comments:comment}
    },{
        new: true
    })
    .populate("comments.postedBy","_id name photo")
    .populate("postedBy","_id name photo")
   
    .exec((err,result) => {
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

//DELETE: "/deletepost/:postId"
router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})

//DELETE: "/deleteComment/:postId/:commetId"
router.delete("/deleteComment/:postId/:commentId", requireLogin, (req,res) => {
    const commentId =  { _id: req.params.commentId };
    Post.findByIdAndUpdate(req.params.postId,{
        $pull:{comments:commentId}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name photo")
    .populate("postedBy","_id name photo")
    .exec((err,result) => {
        if(err || !result){
            return res.status(422).json({error:err})
        }else{
            console.log(result);
            res.json(result)
        }
    })

})


module.exports = router;