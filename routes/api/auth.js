const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

const jwtSecret = require("../../config/keys").jwtSecret;

// User Model
const User = require("../../models/User");

// @route   POST api/auth
// @desc    Authenticate user
// @access  Public
router.post("/", (req, res) => {
  const { name, email, password } = req.body;

  // temporary simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: "Invalid inputs" });
  }

  // check existing user
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    // validate
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      jwt.sign(
        { id: user.id },
        jwtSecret,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;

          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email
            }
          });
        }
      );
    });
  });
});

// @route   GET api/auth/user
// @desc    Get current user data using the token (JWT Auth being stateless)
// @access  Private
router.get("/user", auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password") // remove the password
    .then(user => res.json(user));
});

module.exports = router;
