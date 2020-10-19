const express = require("express");
const mongoose = require("mongoose");


require("dotenv").config()

const PORT = process.env.PORT || 5001;

//MODELS
require("./models/User"); 
require("./models/Post");

//ROUTES
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");

const app = express();


mongoose.connect(process.env.MONGO_URI || MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose is successfully connected');
});




app.use(express.json()); //body parser
app.use(authRoutes);
app.use(postRoutes);
app.use(userRoutes);

// //NODEMAILER



if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    // const path = require('path')
    // app.get("*",(req,res)=>{
    //     res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    // })
}



app.listen(PORT, () => console.log(`Server running on ${PORT}`))