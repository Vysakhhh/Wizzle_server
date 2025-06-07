const mongoose = require('mongoose')

const groupMessageSchema = new mongoose.Schema({

    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groups',
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    text: {
        type:String
    },
    image: {
        type:String
    }
}, { timestamps: true });

const GroupMessage=mongoose.model("GroupMessage",groupMessageSchema)
module.exports=GroupMessage