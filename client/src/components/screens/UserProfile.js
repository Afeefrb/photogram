    import React, {useEffect, useState,useContext} from 'react';
    import Loading from '../../images/loading.gif'

    import {UserContext} from '../../App';
    import {useParams} from 'react-router-dom'; 

    const UserProfile = () => {
        
        const [userProfile, setUserProfile] = useState(null);
        const [showFollow, setshowFollow] = useState(true)

        console.log("Button: ", showFollow);

        const {state,dispatch} = useContext(UserContext);

        const {userId} = useParams(); 

        
        useEffect(() => {
            fetch(`/profile/${userId}`,{   
                headers:{
                    "Authorization":"Bearer " + localStorage.getItem("jwt")
                }
            })
            .then(res => res.json())
            .then(result => {
                setUserProfile(result)
            
            })
            .catch(err => console.log(err))

        
            // setshowFollow((prevState) => {
            //     if(prevState == true){
            //         return true
            //     }
                
            // })

        }, [])

        console.log("userProfile: ", userProfile?.user.followers);

        const followUser = (followId) => {

            if(userProfile?.user.followers.length >= 1) {
                return setshowFollow(false)
            }
        

            fetch("/follow", {
                method:"PUT",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer " + localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    followId:followId
                })
            })
            .then(res => res.json()) //logged in user result
            .then(result => {
                console.log("followUser: ",result);
                dispatch({
                    type:"UPDATE",
                    payload:{
                        followers:result.followers,
                        following:result.following
                    } })
                localStorage.setItem("user",JSON.stringify(result))
                setUserProfile((prevState) => {
                            return{
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:[...prevState.user.followers, result._id]
                        }
                    }
                })
                setshowFollow(false)
            })
        }

        //EXPLAIN: prevState => User Profile {user:{}, posts:{}}
        //         result => Logged in user {_id, name, email, followers, following}


        const unfollowUser = (unfollowId) => {

            

            fetch("/unfollow", {
                method:"PUT",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer " + localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    unfollowId:unfollowId
                })
            })
            .then(res => res.json()) //logged in user result
            .then(result => {
                console.log(result);
                dispatch({
                    type:"UPDATE",
                    payload:{
                        followers:result.followers,
                        following:result.following
                    } })
                localStorage.setItem("user",JSON.stringify(result))
                setUserProfile((prevState) => {
                    const newFollower = prevState.user.followers.filter(follower =>
                        follower != result._id)  
                        
                    return{
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers: newFollower
                        }
                    }
                })
                setshowFollow(true)
            })
        }

        return (

            <>
            {!userProfile? (<img style={{marginLeft:"400px"}} src={Loading}/>)
            :(
    <div>
                <div style={{
                    minWidth:"645px",
                    display:"flex",
                    justifyContent:"center"
                    
                }}>
                        <div>
                            <img style={{
                                width:"150px",
                                height:"150px",
                                borderRadius:"100px"
                            }} src={userProfile?.user.photo} alt=""/>
                        </div>
                        <div style={{marginLeft:"30px"}}> 
                        <h4>{userProfile.user.name}</h4>
                            <div style={{display:"flex", justifyContent:"space-around", width:"108%"}}>
                                <h6>{userProfile.posts.length} Posts</h6>
                                <h6>{userProfile.user.followers.length} Followers</h6>
                                <h6>{userProfile.user.following.length} Following</h6>
                            </div>

                            {showFollow && userProfile.user.followers.length == 0 ? (
                                <button
                                className="btn waves-effect waves-light #448aff blue accent-2"
                                onClick={() => followUser(userProfile.user._id)}  > 
                                Follow</button>

                            ):(
                                <button
                                className="btn waves-effect waves-light #448aff blue accent-2"
                                onClick={() => unfollowUser(userProfile.user._id)}  > 
                                Unfollow </button>
                                
                            )}

                            
                        </div>

                </div>
                
                <div className="gallery">

                    {userProfile.posts.map(pic => {
                        return(
                            <img className="item" key={pic._id} src={pic.photo} alt={pic.name} />

                        )
                    })}
            
                </div>
            </div>
            )}
            </>
            
        )
    }

    export default UserProfile
