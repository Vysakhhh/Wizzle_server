const jwt = require('jsonwebtoken');
const users = require('../model/userModel');

const jwtMiddleware = async (req, res, next) => {
  console.log("inside jwtMiddleware");

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json("Unauthorized: No token provided");
  }

  const token = authHeader.split(' ')[1];

  try {
    const jwtResponse = jwt.verify(token, process.env.JWT_SECRET);
    if (!jwtResponse) {
      return res.status(401).json("Unauthorized: Invalid token");
    }

    const user = await users.findById(jwtResponse.userId).select("-password");
    if (!user) {
      return res.status(404).json("User not found");
    }

    req.user = user;
    next();

  } catch (err) {
    console.log("Error in jwtMiddleware", err.message);
    res.status(401).json("Unauthorized: Token verification failed");
  }
};

module.exports = jwtMiddleware;
