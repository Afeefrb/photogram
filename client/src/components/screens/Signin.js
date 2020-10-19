import React, {useState, useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css'; 
import {UserContext} from '../../App';

const Signin = () => {

    const {state,dispatch} = useContext(UserContext)
    
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");

    const history = useHistory()

    const PostData = () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            return M.toast({html:"Invalid email" , classes:"#e57373 red lighten-2"});
           
        }
        fetch("/signin", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.error){
                M.toast({html:data.error, classes:"#e57373 red lighten-2"})
            } else {
                //coming from server: res.json({token, user:{_id, name, email}})
                localStorage.setItem("jwt", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                dispatch({type:"USER", payload: data.user})
                M.toast({html:"Signed in successfully", classes:"#4caf50 green"})
                history.push("/")
            }
        })
    }
    
    return (
        <div className="myCard">
            <div className="card auth-card input-field">
                <h2>Photogram</h2>
                <p>Please enter the fields below</p>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}  />

               <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}  />

                <button
                  className="btn waves-effect waves-light #448aff blue accent-2"
                  onClick={() => PostData()}  > 
                  Login</button>

                  

                <Link to="/reset-password">
                    <button style={{fontSize:"small", width:"max-content"}} className="btn waves-effect waves-light #1565c0 blue darken-1">
                         Forgot Password?
                    </button>
                </Link>
                 

                <Link to="/signup">
                <button className="btn waves-effect waves-light #1565c0 blue darken-1">
                   Don't have an account? Signup 
                </button>
                </Link>
                 
            </div>
        </div>
    )
}

export default Signin
