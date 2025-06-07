const groups = require('../model/groupModel')
const users = require('../model/userModel')
const cloudinary = require('../lib/cloudinary')
const GroupMessage = require('../model/groupMessageModel')
const { io } = require('../lib/socket')

exports.addGroupController = async (req, res) => {

    console.log("inside addGroupController");

    const { members, groupName } = req.body
    const userId = req.user._id

    try {

        const admin = await users.findById(userId)

        if (!admin) {
            return res.status(401).json("admin user not found")
        }

        const validMembers = await users.find({ _id: { $in: members } })

        if (validMembers.length !== members.length) {
            return res.status(401).json("members are not valid users")
        }

        const newGroup = new groups({
            groupName,
            members: [...members, userId],
            admin: userId
        })
        await newGroup.save()
        res.status(200).json(newGroup)


    }
    catch (err) {
        console.log("Error in addGroupController", err);
        res.status(500).json("internal server error")
    }


}

exports.getGroupController = async (req, res) => {
    console.log("inside getGroupController");

    const userId = req.user._id;

    try {
        const userGroups = await groups.find({ members: userId });
        res.status(200).json(userGroups);
    } catch (err) {
        console.log("error in getGroupController", err);
        res.status(500).json("Internal server error");
    }
};

exports.getGroupMessagesController = async (req, res) => {

    console.log("inside getGroupMessagesController");

    const { groupId } = req.params;

    try {
        const messages = await GroupMessage.find({ groupId })
            .populate('senderId', 'fullName profilePic')
            .sort({ createdAt: 1 });

        res.status(200).json(messages);

    } catch (err) {
        console.log("error in getGroupMessagesController", err);
        res.status(500).json("Internal server error")

    }
};

exports.sendMessageGroupController = async (req, res) => {
    console.log("inside sendMessageGroupController");

    const { text, image } = req.body
    const { groupId } = req.params
    const senderId = req.user._id
    console.log(groupId);


    try {

        let imageUrl;

        if (image) {
            const uploadedResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadedResponse.secure_url
        }

        let groupMessage = await new GroupMessage({
            groupId,
            senderId,
            text,
            image: imageUrl
        })

        await groupMessage.save()

        groupMessage = await groupMessage.populate("senderId", "fullName profilePic");

        io.to(groupId.toString()).emit("newGroupMessage", groupMessage);

        res.status(200).json(groupMessage)

    }
    catch (err) {
        console.log("error in sendMessageGroupController", err);
        res.status(500).json("Internal server error")

    }

}

