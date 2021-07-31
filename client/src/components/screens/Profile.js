import React, {useEffect, useState,useContext} from 'react';
import {UserContext} from '../../App';

const Profile = () => { 
    
    const [myPosts, setMyPosts] = useState([]);
    const [image, setImage] = useState("");
    const [imageUrl, setImageUrl] = useState(undefined); 


    const {state,dispatch} = useContext(UserContext); 

    useEffect(() => {

        fetch("/myposts",{
            headers:{
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            console.log("result.myPosts: ", result.myposts);
            setMyPosts(result.myposts)
            
        })
        .catch(err => console.log(err))
    }, [])

    useEffect(() => {

        if(image){
            const data = new FormData();
            data.append("file",image);
            data.append("upload_preset","photogram");
            data.append("cloud_name","dbyixrfgw");
            fetch("https://api.cloudinary.com/v1_1/dbyixrfgw/image/upload", {
                method:"POST",
                body:data
            })
            .then(res => res.json())
            .then(data => {
                setImageUrl(data.url)
                
                fetch("/uploadpic",{
                    method:"PUT",
                    headers:{
                        "Authorization": "Bearer " + localStorage.getItem("jwt"),
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({photo:data.url})
                })
                .then(res => res.json())
                .then(result => {
                    console.log(result);
                    localStorage.setItem("user", JSON.stringify({...state, photo:result.url}));
                    dispatch({type:"UPDATEPIC", payload:result.url})
                })
            })
            .catch(err => console.log(err))
        }
        
    }, [image])


    const uploadPic = (file) => {
        setImage(file);
    }



    return (
        <div  className="profile">
            <div className="profile__container">
                    <div className="imgButton">

                        <img className="profile__img"
                             style={{
                            width:"150px",
                            height:"150px",
                            borderRadius:"100px"
                        }} src={state?state.photo:""} alt=""/>



                        <div className="file-field input-field">
                            <div className="btnx blue darken-1">
                                <span>Edit</span>
                                <input type="file" onChange={(e) => uploadPic(e.target.files[0])} />
                            </div>
                           <div className="file-path-wrapper">
                                <input className="file-path validate" type="text" />
                            </div>
                        </div>  

                    </div>



                    <div className="profile__details"> 
                    <h4>{state?.name}</h4>
                    <h5>{state?.email}</h5>  
                        <div style={{display:"flex", justifyContent:"space-around"}}>
                            <h6>{myPosts.length} posts</h6> &nbsp;
                            <h6>{state?.followers.length} followers</h6> &nbsp;
                            <h6>{state?state.following.length:0} following</h6>
                        </div>
                    </div>

            </div>
            
            <div className="gallery">

                {myPosts?.map(myPost => {
                    return(
                        <img className="item" key={myPost._id} src={myPost.photo} alt={myPost.name} />

                    )
                })}
          
            </div>
        </div>
    )
}

export default Profile
