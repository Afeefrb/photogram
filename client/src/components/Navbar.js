import React, {useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {UserContext} from '../App';

const Navbar = () => {
    const {state, dispatch} = useContext(UserContext);
    const history = useHistory();

    const renderNavList = () => {

        if(state){
            return [
                <div  className="right-links"> 
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/followingFeed">Following Feed</Link></li>
                    <li><Link to="/profile">My Profile</Link></li>
                    <li><Link to="/create">Create Post</Link></li>
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

                </div>
                    
            ]
    
        } else {
            return [
                <div>
                   
                     <li><Link to="/signin">Login</Link></li>
                     <li><Link to="/signup">Signup</Link></li>
                </div>
      
            ]
    
        }

    }
    
   

    return (
        <nav>
            <div className="nav-wrapper white">
            <Link to={state? "/" : "/signin"} className="brand-logo left">Photogram</Link>
            <ul id="nav-mobile" key={state?._id}>

                {renderNavList()}
                
            </ul>
            </div>
        </nav>
        
    )
}

export default Navbar
