const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const token = jwt.sign({ userId: user._id, role: user.role },process.env.JWT_SECRET, { expiresIn: "7d"});
  return token;
};

module.exports = generateToken;
