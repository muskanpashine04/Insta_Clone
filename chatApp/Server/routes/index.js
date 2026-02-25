const express = require("express");
const { signup, login } = require("../controllers/authController");
const { getUsers } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/users", auth, getUsers);

module.exports = router;
