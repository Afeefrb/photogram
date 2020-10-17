import React, {useState, useEffect,useContext} from "react";
import {UserContext} from '../../App';
import M from 'materialize-css'; 
import {Link} from 'react-router-dom'
import Loading from '../../images/loading.gif';

const FollowingFeed = () => {
 
  const [posts, setPosts] = useState([])
  const [inputEntr,setInputEntr] = useState("");
  const {state, dispatch} = useContext(UserContext); 

  useEffect(() => {
    
    fetch("/followingFeed", {
      headers:{
        "Authorization": "Bearer " + localStorage.getItem("jwt") 
      }
    })
    .then(res => res.json())
    .then(result => {
      console.log("result.posts: ", result.posts);
      setPosts(result?.posts?.reverse())
    })
 
  }, [])



  const likePost = (id) => {
    fetch("/like", {
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId:id
      })
    })
    .then(res => res.json())
    .then(result => {
      const updatedPosts = posts.map(post => {
        if(post._id === result._id) {
          return result
        } else {
          return post
        }
      })
      setPosts(updatedPosts)
    }).catch(err =>console.log(err))
  }

  const unlikePost = (id) => {
    fetch("/unlike", {
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId:id
      })
    })
    .then(res => res.json())
    .then(result => {
      const updatedPosts = posts?.map(post => {
        if(post._id === result._id) {
          return result
        } else {
          return post
        }
      })
      setPosts(updatedPosts)
    }).catch(err =>console.log(err))
  }

  const comment = (text,postId) => {
    fetch("/comment", {
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        text,
        postId
      })
    })
    .then(res => res.json())
    .then(result => {
      console.log("comment:" , result);
      const newPost = posts?.map(post=>{
        if(post._id === result._id){
          return result
        }else{
          return post
        }
      })
      setPosts(newPost);
      setInputEntr("");
    }).catch(err =>console.log(err))
  }

  const deletePost = (postid)=>{
    fetch(`/deletepost/${postid}`,{
        method:"delete",
        headers:{
            "Authorization":"Bearer "+ localStorage.getItem("jwt")
        }
    }).then(res=>res.json())
    .then(result=>{
        console.log("Delete: ",result)
        const newData = posts.filter(post=>{
            return post._id !== result._id
        })
        setPosts(newData);
        M.toast({html:"Deleted Post" , classes:"#e57373 red lighten-2"});
    })
}

const deleteComment = (postId, commentId) => {
  fetch(`/deleteComment/${postId}/${commentId}`, {
    method:"DELETE",
    headers:{
      "Authorization":"Bearer "+ localStorage.getItem("jwt")
    }
  })
    .then(res=>res.json())
    .then(result=>{
        console.log("Delete Comment: ",result)
        const newData = posts.map(post => {
          if(post._id === result._id){
            return result
          } else {
            return post
          }
        })
        setPosts(newData)
        })
} 

console.log("posts: ",posts);



  return (
    <div className="home">

    {posts.length==0 && (<img className="loading" src={Loading} />)}
    

      {posts?.map(post => (
        
        <div className="card home-card" key={post._id}>


<div className="heading">

<img src={post.postedBy.photo} style={{width:"10%", borderRadius:"50%"}} />

<div className="nameIcon">

<h6>
<Link to={`/profile/${post.postedBy._id}`}>{post.postedBy.name}</Link>
</h6>

  {post.postedBy._id == state?._id && ( <i
    className="material-icons"
    style={{cursor:"pointer"}}
    onClick={()=>deletePost(post._id)}>delete</i>)}


</div>

</div>



        <div className="card-image">
          <img
            src={post.photo}
            alt=""
          />
        </div>
        <div className="card-content">
      
        <div className="icons">
          <i className="material-icons" style={{color:"red"}}>favorite</i>
        {/* like & unlike post*/}

        {
          post.likes.includes(state?._id)
          ? (
            <i
            className="material-icons"
            onClick={()=>unlikePost(post._id)}>thumb_down</i>
          ):(
            <i
            className="material-icons"
            onClick={()=>likePost(post._id)}>thumb_up</i>
          )
        }

        <p className="likes"> {post.likes.length} </p>
          </div>

     


          
        <p>{post.title}</p>
        <p>{post.body}</p>

        {/* Comments  */}

        {
          post?.comments?.map(comment => {
            // console.log("post.postedBy._id: ",post.postedBy._id);
            // console.log("comment._id", comment._id);
            return (
              <h6 className="comment" key={comment._id + Math.random() * 2}> <span style={{fontWeight:"600"}}> {comment.postedBy.name} </span> {comment.text}
               
             
              {comment.postedBy._id === state?._id && (
               
               <i
                 style={{color:"blue",
                 cursor:"pointer",
                 float:"right"}}
                 className="material-icons"
                 onClick={()=>deleteComment(post._id,comment._id)}>delete</i>
              )}

              
               </h6>
            )
          })
        }

        {/* Comments Form */}
        <form onSubmit={(e) => {
          e.preventDefault();
          comment(e.target[0].value , post._id);
        }}>
          <input type="text" placeholder="add a comment" value={inputEntr} onChange={(e) => setInputEntr(e.target.value)} />

        </form>
        
        </div>
       </div>
      
      ))
      
      }
  

      </div>

   
  );
};

export default FollowingFeed;
