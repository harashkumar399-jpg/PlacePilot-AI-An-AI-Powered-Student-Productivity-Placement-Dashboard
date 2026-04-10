const User = require("../models/user");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = new User({ name, email, password });
    await user.save();

    res.json({ message: "User registered" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser };