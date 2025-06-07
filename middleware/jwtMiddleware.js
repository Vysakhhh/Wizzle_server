const jwt = require('jsonwebtoken')
const users = require('../model/userModel')

const jwtMiddleware = async (req, res, next) => {
    console.log("inside jwtMiddleware");

    const token = req.cookies?.jwt

    console.log(token);
    

    try {

        if (!token) {
            return res.status(400).json("Unauthorized  ..No token provided")
        }

        const jwtResponse = jwt.verify(token, process.env.JWT_SECRET)
        if (!jwtResponse) {

            return res.status(401).json({ message: "Unauthorized ...Invalid Token" })

        }

        const user = await users.findById(jwtResponse.userId).select("-password")
        if (!user) {
            return res.status(404).json("User not found")
        }

        req.user = user
        next()


    }
    catch (err) {
        console.log("Error in jwtMiddleware", err.message);

        res.status(500).json({ message: "internal server error" })
    }
}



module.exports = jwtMiddleware
