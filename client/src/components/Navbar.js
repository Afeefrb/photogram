import React, {useContext, useRef, useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {UserContext} from '../App';
import M from 'materialize-css'; 

const Navbar = () => {
    const {state, dispatch} = useContext(UserContext);
    const [search, setSearch] = useState("");
    const [userDetails,setUserDetails] = useState([])
    const history = useHistory();

    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);

    const searchModal = useRef(null);

    useEffect(() => {   
        M.Modal.init(searchModal.current)
        setClick(false)

    },[])


    const renderNavList = () => {

     
        if(state){
            return [
                <div  className="right-links" onClick={handleClick}> 
                    
                    <li key="1"> <i data-target="modal1" className="search large material-icons modal-trigger">search</i> </li>
                    <br></br>
                    <li key="2"><Link to="/">Home</Link></li>
                    <li key="3"><Link to="/followingFeed">Following Feed</Link></li>
                    <li key="4"><Link to="/profile">My Profile</Link></li>
                    <li key="5"><Link to="/create">Create Post</Link></li>
                    <li className="lgt-btn">
                        <button className="btn btnx2 waves-effect waves-light"
                        onClick={()=>{
                            localStorage.clear()
                            dispatch({type:"CLEAR"})
                            history.push("/")
                        }}>
                            Logout
                        </button>
                    </li>

                    <li>
                            <i 
                                className="material-icons close"
                                onClick={handleClick}>
                                    {click?  "clear": null} 
                            </i>

                    </li>
                    
                    

                   
                </div>
                    
            ]
    
        } else {
            return [
                <div className="right-links" onClick={handleClick}>
                   
                     <li key="1"><Link to="/signin">Login</Link></li>
                     <li key="2"><Link to="/signup">Signup</Link></li>

                </div>
      
            ]
    
        }

        
    }
    const fetchUser = (query)=>{
        setSearch(query)
        fetch('/search-users',{
          method:"post",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            query
          })
        }).then(res=>res.json())
        .then(result => {
            console.log("results.user",result.user);
          setUserDetails(result.user)
        })
     }
   

    return (
        <nav>
            <div className="nav-wrapper white">
            <Link to={"/"} className="brand-logo left">Photogram</Link>
            <i 
                className="material-icons menu"
                onClick={handleClick}>
                    {click?  "clear" :"menu"}
            </i>
            
            <ul className={click? "nav-mobile-active":"nav-mobile"} key="#123">

                {renderNavList()}
                
            </ul>
            </div>
{/* 
            <!-- Modal Structure --> */}

            <div id="modal1" class="modal" ref={searchModal} style={{color:"black"}}>
                <div class="modal-content">
                    <input
                    type="text"
                    placeholder="Search users"
                    value={search}
                    onChange={(e) => fetchUser(e.target.value)}  />
                        <ul class="collection">

                            {userDetails?.map(item => (
                                <Link to={item._id !== state?.id ? `/profile/${item._id}`:`/profile`}
                                onClick={()=>{
                                    M.Modal.getInstance(searchModal.current).close()
                                }}>
                                     <li key={item._id} class="collection-item">{item.name}</li>
                                </Link>
                            ))}
               
                    </ul>
                                    
                </div>
                <div class="modal-footer">
                <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>
                </div>
            </div>
        </nav>
        
    )
}

export default Navbar
