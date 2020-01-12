const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/keys").jwtSecret;

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    res.status(401).json({ msg: "No token, unauthorized" });
  }

  // verify token
  try {
    const decoded = jwt.verify(token, jwtSecret);
    // add user from payload
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Token is invalid" });
  }
}

module.exports = auth;
