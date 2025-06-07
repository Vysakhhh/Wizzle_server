const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({

    groupName:{
        type:String,
        required:true
    },
    members:[
        {
            type:mongoose.Schema.Types.ObjectId ,
            ref:"users",
            required:true
             
    }],
    admin:{
       type:mongoose.Schema.Types.ObjectId ,
            ref:"users",
            required:true
    }
},
   {timestamps:true})


const groups = mongoose.model("groups",groupSchema)
module.exports=groups