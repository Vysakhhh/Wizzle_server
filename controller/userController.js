const generateToken = require('../lib/utlis')
const users = require('../model/userModel')
const bcrypt = require('bcrypt')
const cloudinary = require('../lib/cloudinary')


exports.signUpController = async (req, res) => {
    console.log("inside signUpController");

    const { fullName, email, password } = req.body

    try {

        if (password.length < 6) {
            return res.status(401).json("password must be atleast 6 characters!!")

        }

        const existingUser = await users.findOne({ email })

        if (existingUser) {
            return res.status(406).json("user already exists  ...Please login")

        }


        const encryptedPassword = await bcrypt.hash(password, 10)
        const newUser = new users({ fullName, email, password: encryptedPassword, profilePic: "" })

        if (newUser) {
           
            generateToken(newUser._id, res)
            await newUser.save()
            return res.status(200).json(newUser)
        }



    }
    catch (err) {
        console.log("Error in signUpController", err.message);
        res.status(500).json("Internal Server error")
    }

}

exports.logInController = async (req, res) => {

    console.log("inside logInController");

    const { email, password } = req.body

    try {

        const existingUser = await users.findOne({ email })

        if (existingUser) {
            let isUserPswdMatch = await bcrypt.compare(password, existingUser.password)

            if (isUserPswdMatch || password == existingUser.password) {
                generateToken(existingUser, res)
                return res.status(200).json(existingUser)
            }
            else {
                res.status(400).json("Invalid credentials")
            }

        }
        else {
            res.status(400).json("Invalid credentials")
        }

    }
    catch (err) {
        console.log("Error in logInController", err.message);
        res.status(500).json("Internal Server error" )

    }

}

exports.logOutController = async (req, res) => {
  console.log("Inside logOutController");

  try {
    res.cookie("jwt", "",{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      path: "/", 
      maxAge: 0,
    });

    res.status(200).json( "Logged out successfully");
  } catch (err) {
    console.error("Error in logOutController:", err.message);
    res.status(500).json("Internal server error" );
  }
};

exports.updateProfileController = async (req, res) => {
    console.log("inside updateProfileController");

    const { profilePic } = req.body
    const userId = req.user._id

    try {

        if (!profilePic) {
            return res.status(400).json("profilePic is required")
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await users.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })

        res.status(200).json(updatedUser)

    }
    catch (err) {
        console.log("Error in updateProfileController", err.message);
        res.status(500).json("Internal server error")


    }

}

exports.checkAuthentication = async (req, res) => {

    console.log("inside checkAuthentication");

    try {
        res.status(200).json(req.user)
    }
    catch (err) {
        console.log("Error in checkAuthentication", err.message);
        res.status(500).json("Internal server error" )

    }

}
