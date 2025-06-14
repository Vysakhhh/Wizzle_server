const jwt = require('jsonwebtoken');

const generateToken = (user, res) => {
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" } );

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });

  return token;
};

module.exports = generateToken;
