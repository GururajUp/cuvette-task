const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Missing Authorization header" });
    }

    const tokenData = req.headers["authorization"].split(" ");
    const token = tokenData[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized access" });
    } else {
      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decode;
    }
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = verifyToken;