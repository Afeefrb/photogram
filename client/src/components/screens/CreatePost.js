import React, {useState, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';


const CreatePost = () => {

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState(""); 

    const history = useHistory();

    useEffect(() => {
        let unsubscribe = true;
        if(url && unsubscribe) {
            //https://localhost:5001/createpost
        fetch("/createpost", {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                title,
                body,
                pic: url
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.error){
                M.toast({html:data.error, classes:"#e57373 red lighten-2"})
            } else {
                M.toast({html:"Post created", classes:"#4caf50 green"})
                history.push("/")
            }
        })
        }

        return () => {
            unsubscribe = false;
        }
      
    }, [url])

    const postData = () => {
        if(!title || !body) {
          
             M.toast({html:"Please enter title and body", classes:"#e57373 red lighten-2"})
         
        } else if (!image) {
            M.toast({html:"Please upload a photo", classes:"#e57373 red lighten-2"})
        }
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
            setUrl(data.url)
        })
        .catch(err => console.log(err))
        
        
    }


    return (
        <div className="card input-field" style={{
            maxWidth:"600px",
            textAlign:"center",
            margin:"30px auto",
            padding: "20px"
        }}>
            <input type="text" placeholder="title" value={title}
                  onChange={(e) => setTitle(e.target.value)} />

            <input type="text" placeholder="body" value={body}
                  onChange={(e) => setBody(e.target.value)}  />

            

            <div className="file-field input-field">
                 <div className="btnx blue darken-1">
                    <span>UPLOAD PHOTO</span>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                 </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>  
            <button className="btn blue darken-2" onClick={() => postData()}>
                   Post
                </button>


        </div>
    )
}

export default CreatePost
