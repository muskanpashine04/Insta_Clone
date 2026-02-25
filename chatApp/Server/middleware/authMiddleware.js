const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ message: "No token" });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, "secret");

    req.user = decoded;
    next();

  } catch (err) {
    console.log("Auth error:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};
