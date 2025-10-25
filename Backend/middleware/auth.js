const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id, "tokens.token": token });

    if (!user) return res.status(401).json({ msg: "Token invalid" });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Unauthorized" });
  }
};

module.exports = auth;
