const generateToken = require('../lib/utlis')
const users = require('../model/userModel')
const bcrypt = require('bcrypt')
const cloudinary = require('../lib/cloudinary')


exports.signUpController = async (req, res) => {
  console.log("inside signUpController");

  const { fullName, email, password } = req.body;

  try {
    if (password.length < 6) {
      return res.status(400).json("Password must be at least 6 characters");
    }

    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.status(409).json("User already exists, please login");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = new users({ fullName, email, password: encryptedPassword, profilePic: "" });

    await newUser.save();

    const token = generateToken(newUser);

    return res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        profilePic: ""
      },
    });

  } catch (err) {
    console.log("Error in signUpController", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.logInController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await users.findOne({ email });

    if (!existingUser) {
      return res.status(401).json('Invalid credentials');
    }

    const isUserPswdMatch = await bcrypt.compare(password, existingUser.password);


    if (isUserPswdMatch || password === existingUser.password) {

      const token = generateToken(existingUser);

      res.status(200).json({
        token,
        user: {
          _id: existingUser._id,
          fullName: existingUser.fullName,
          email: existingUser.email,
          role: existingUser.role,
          profilePic: existingUser.profilePic || ""
        },
      });
    }
    else {
      res.status(409).json("Invalid credentials")
    }

  }
  catch (err) {
    console.log("Error in loginInController", err);
    res.status(500).json("Internal server error")

  }
};

exports.logOutController = async (req, res) => {
  console.log("Inside logOutController");
  try {
    res.status(200).json("Logged out successfully");
  } catch (err) {
    console.error("Error in logOutController:", err.message);
    res.status(500).json("Internal server error");
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

  const user = req.user

  try {
    res.status(200).json(user)
  }
  catch (err) {
    console.log("Error in checkAuthentication", err.message);
    res.status(500).json("Internal server error")

  }

}
