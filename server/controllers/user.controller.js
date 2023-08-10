const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

// Update user
exports.updateUser = async (req, res) => {
  if (req.body.userId === req.params.userId || req.body.isAdmin) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $set: req.body.data,
        },
        { new: true }
      );
      const { password, ...others } = updatedUser._doc;
      res.status(200).send({
        success: true,
        message: "Account has been updated",
        user: { ...others },
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  } else {
    return res
      .status(403)
      .json({ error: true, message: "You can only update your account" });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  if (req.body.userId === req.params.userId || req.body.isAdmin) {
    try {
      if (!req.body.oldPassword || !req.body.newPassword || !req.body.data) {
        return res
          .status(400)
          .json({ error: true, message: "Required fields are empty" });
      }

      const user = await User.findById(req.params.userId);

      if (req.body.newPassword === req.body.oldPassword) {
        return res.status(400).json({
          error: true,
          message: "New password cannot be the same as old password",
        });
      }

      const validPassword = bcrypt.compareSync(
        req.body.oldPassword,
        user.password
      );
      if (!validPassword) {
        return res
          .status(401)
          .json({ error: true, message: "Old password is incorrect" });
      }

      if (req.body.newPassword !== req.body.data) {
        return res
          .status(401)
          .json({ error: true, message: "Passwords do not match" });
      }

      if (req.body.data.length < 8) {
        return res.status(400).json({
          error: true,
          message: "New password must be at least 8 characters long",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.data, salt);

      await User.findByIdAndUpdate(req.params.userId, {
        password: hashedPassword,
      });

      res.status(200).json({
        success: true,
        message: "Password has been updated",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  } else {
    return res
      .status(403)
      .json({ error: true, message: "You can only update your account" });
  }
};

// Get user
exports.getUser = async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;

  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
};
