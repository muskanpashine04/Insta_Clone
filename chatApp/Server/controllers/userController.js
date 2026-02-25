const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "username");
    res.json(users);
  } catch (err) {
    console.log("Users error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
