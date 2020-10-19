import React, {useState, useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css'; 

const Reset = () => {


    const [email,setEmail] = useState("");

    const history = useHistory()

    const PostData = () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            return M.toast({html:"Invalid email" , classes:"#e57373 red lighten-2"});
           
        }
        fetch("/reset-password", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.error){ 
                M.toast({html:data.message, classes:"#e57373 red lighten-2"})
            } else {
                M.toast({html:data.message, classes:"#4caf50 green"})
                history.push(`/new-password/${data.token}`)
            }
        })
    }
    
    return (
        <div className="myCard">
            <div className="card auth-card input-field">
                <h2>Photogram</h2>
                <p>Please enter the field below</p>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}  />

                <button
                  className="btn waves-effect waves-light #448aff blue accent-2"
                  onClick={() => PostData()}  > 
                  Reset Password</button>

            
                 
            </div>
        </div>
    )
}

export default Reset
