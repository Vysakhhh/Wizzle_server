const mongoose=require('mongoose')

const userSchema= new mongoose.Schema({

    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    role:{
        type:String,
        required:true,
        enum: ['admin', 'User'],
        default:"User"
    },
    profilePic:{
        type:String,
        default:""
    },

}, {timestamps:true})

const users =mongoose.model("users",userSchema)
module.exports=users