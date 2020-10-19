const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true 
    },
    password:{
        type: String,
        required: true
    },
    followers:[{type:ObjectId, ref:"User"}],
    following:[{type:ObjectId, ref:"User"}],
    resetToken: String,
    expireToken: Date,
    photo: {
        type:String,
        default:"https://www.pngitem.com/pimgs/m/78-786293_1240-x-1240-0-avatar-profile-icon-png.png"
    }
})

mongoose.model("User", userSchema);