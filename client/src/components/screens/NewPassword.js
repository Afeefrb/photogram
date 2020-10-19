import React, {useState, useContext} from 'react';
import {Link, useHistory, useParams} from 'react-router-dom';
import M from 'materialize-css'; 

const NewPassword = () => {


    
    const [password,setPassword] = useState("");
    const {token} = useParams();

    const history = useHistory();

    const PostData = () => {
        
        fetch("/new-password", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                password,
                token
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.error){
                M.toast({html:data.error, classes:"#e57373 red lighten-2"})
            } else {
        
                M.toast({html:data.message, classes:"#4caf50 green"})
                history.push("/signin")
            }
        })
        .catch(err=>{
            console.log(err)
        })
        
    }
    
    return (
        <div className="myCard">
            <div className="card auth-card input-field">
                <h2>Photogram</h2>
                <p>Please enter a new password</p>
              
               <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}  />

                <button
                  className="btn waves-effect waves-light #448aff blue accent-2"
                  onClick={() => PostData()}  > 
                  Change Password</button>

                <Link to="/signup">
                <button className="btn waves-effect waves-light #1565c0 blue darken-1">
                   Don't have an account? Signup 
                </button>
                </Link>
                 
            </div>
        </div>
    )
}

export default NewPassword
