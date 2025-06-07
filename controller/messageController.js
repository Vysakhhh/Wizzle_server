const cloudinary=require('../lib/cloudinary')
const messages =require('../model/messageModel')
const users =require('../model/userModel')
const {getRecieverSocketId ,io}=require('../lib/socket')

exports.getUsersForSidebar=async(req,res)=>{
    console.log("inside getUsersForSidebar");

    const loggedUserId=req.user._id
    
    try{

        const filteredUsers= await users.find({_id:{$ne:loggedUserId },role: { $ne: 'admin' }}).select("-password")
             res.status(200).json(filteredUsers)

    }
    catch(err){
        console.log("Error in getUsersForSidebar", err.message);
        res.status(500).json("Internal server error")
        
    }

    
}

exports.getMessages=async(req,res)=>{
    console.log("inside getMessages");

    const {id:recieverId}=req.params
    const senderId=req.user._id

    try{

        const chats=await messages.find({
            $or:[
                {senderId,recieverId},
                {senderId:recieverId,recieverId:senderId},
              ]
        })
      
     res.status(200).json(chats)
    }
    catch(err){
        console.log("Error in getMessages");
        res.status(500).json("Internal server error")
        
    }
    
}

exports.sendMessages=async(req,res)=>{
    console.log("inside sendMessages");

    const {id:recieverId}=req.params
    const {text,image,emoji}=req.body
    const senderId=req.user._id


    try{

        let imageUrl;

        if(image){
            // uploading image to cloudianry
            const uploadResponse=await cloudinary.uploader.upload(image)
            imageUrl=uploadResponse.secure_url
        }
       
        const newMessage = new messages({
            senderId,
            recieverId,
            text,
            image:imageUrl,
            emoji
        })
        await newMessage.save()

        const recieverSocketId=getRecieverSocketId(recieverId)
         if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage",newMessage)
         }
        res.status(200).json(newMessage)
    }
    catch(err){
        console.log("Error in sendMessages",err);
        res.status(500).json("internal server error")
        
    }
    
}
