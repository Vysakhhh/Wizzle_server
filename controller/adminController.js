const groups = require('../model/groupModel')
const users = require('../model/userModel')

exports.getAllGroupController = async (req, res) => {
    console.log("inside getAllGroupController");

    try {
        const getAllGroups = await groups.find().populate('members', 'profilePic name email')
        if (getAllGroups) {
            res.status(200).json(getAllGroups)
        }

    }
    catch (err) {
        console.log("error in getAllGroupController", err);
        res.status(500).json("Internal server error")
    }

}

exports.removeGroupController = async (req, res) => {
    console.log("inside removeGroupController");

    const { groupId } = req.params;

    try {
        const removedGroup = await groups.findByIdAndDelete(groupId);
        if (!removedGroup) {
            return res.status(404).json("Group not found");
        }
        res.status(200).json(removedGroup);
    } catch (err) {
        console.log("error in removeGroupController", err);
        res.status(500).json("Internal server error");
    }
};

exports.removeUserController = async (req, res) => {
    console.log("inside removeUserController");

    const { userId } = req.params
    try {

        const removedUser = await users.findByIdAndDelete(userId)
        if (!removedUser) {
            return res.status(404).json("User not found")
        }
        res.status(200).json(removedUser)

    }
    catch (err) {
        console.log("error in removeUserController", err);
        res.status(500).json("Internal server error")

    }

}
