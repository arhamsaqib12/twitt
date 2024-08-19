const jwt = require("jsonwebtoken");
const { secretKey } = require("./authcontroller");

function checkAuth(req, res, next) {
  const token = req.headers.authorization;


  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Malformed token" });
  }

  try {
    const jwtDecoded = jwt.verify(token, secretKey);
    req.user = jwtDecoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}

module.exports = checkAuth;
