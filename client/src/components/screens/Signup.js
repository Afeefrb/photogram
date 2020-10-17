import React, {useState, useEffect, useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';
import {UserContext} from '../../App';


const Signup = () => { 

    const [name,setName] = useState("");
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const [image, setImage] = useState("");
    const [imageUrl, setImageUrl] = useState(undefined); 

    const history = useHistory();
    const {state,dispatch} = useContext(UserContext)

    useEffect(() => {
       if(imageUrl) {
           uploadAllOtherFields();
       }
    }, [imageUrl])

    const uploadPic = () => {

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
    })
    .catch(err => console.log(err))

    }

    const uploadAllOtherFields = () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            return M.toast({html:"Invalid email" , classes:"#e57373 red lighten-2"});
           
        }
        fetch("/signup", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                pic:imageUrl
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
    }

 

    //======P O S T - DATA================/////////////////

    const PostData = () => {
        
        if(!name || !password || !email) {
          
            M.toast({html:"Please enter all fields", classes:"#e57373 red lighten-2"})
     
    }

        if(image) uploadPic();
        else {uploadAllOtherFields()}
    }
    
    return (
        <div className="myCard">
            <div className="card auth-card input-field">
                <h2>Photogram</h2>
                <p>Please enter the fields below</p>

                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)} />

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

                <div className="file-field input-field">
                    <div className="btnx blue darken-1">
                        <span>UPLOAD PICTURE</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>  

                {image?(<img src={image.name} alt=""/>):""}

                
           
                <button
                  className="btn waves-effect waves-light #448aff blue accent-2"
                  onClick={() => PostData()}> Signup</button>
                  
                <Link to="/signin" >
                    <button className="btn waves-effect waves-light #1565c0 blue darken-2">

                     Already have an account? Signin 
                    </button>
                </Link>
    
            </div>
        </div>
    )
}

export default Signup
