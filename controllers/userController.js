const mongoose = require("mongoose");
const { User, Thought } = require("../models");

// Utility function to remove __v from the result
function removeVersionField(doc) {
  if (Array.isArray(doc)) {
    return doc.map((d) => {
      const obj = d.toObject();
      delete obj.__v;
      return obj;
    });
  } else if (doc) {
    const obj = doc.toObject();
    delete obj.__v;
    return obj;
  }
  return doc;
}

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .select("-__v") // Exclude the __v field from the results
      .then((users) => res.json(removeVersionField(users)))
      .catch((err) => {
        console.error(
          `[${req.method} ${req.originalUrl}] Error fetching users:`,
          err
        );
        res
          .status(500)
          .json({ message: "Failed to fetch users.", error: err.message });
      });
  },

  // Get a single user by ID
  getSingleUser(req, res) {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    User.findOne({ _id: userId })
      .select("-__v")
      .populate("friends", "-__v")
      .populate("thoughts", "-__v")
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json({ message: `No user found with ID: ${userId}` });
        }
        res.json(removeVersionField(user));
      })
      .catch((err) => {
        console.error(
          `[${req.method} ${req.originalUrl}] Error fetching user with ID: ${userId}`,
          err
        );
        res
          .status(500)
          .json({ message: "Failed to fetch user.", error: err.message });
      });
  },

  // Create a new user
  createUser(req, res) {
    User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    })
      .then((existingUser) => {
        if (existingUser) {
          return res.status(400).json({
            message: "Username or email already exists. Please choose another.",
          });
        }

        return User.create(req.body)
          .then((user) => {
            res.status(201).json(removeVersionField(user));
          })
          .catch((err) => {
            if (err.name === "ValidationError") {
              console.error(
                `[${req.method} ${req.originalUrl}] Validation Error:`,
                err
              );
              return res.status(400).json({
                message: "Validation failed. Please check the provided data.",
                errors: err.errors,
              });
            }

            console.error(
              `[${req.method} ${req.originalUrl}] Error creating user:`,
              err
            );
            res
              .status(500)
              .json({ message: "Failed to create user.", error: err.message });
          });
      })
      .catch((err) => {
        console.error(
          `[${req.method} ${req.originalUrl}] Error checking existing user:`,
          err
        );
        res.status(500).json({
          message: "Failed to check existing user.",
          error: err.message,
        });
      });
  },

  // Update a user by ID
  updateUser(req, res) {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    User.findOneAndUpdate(
      { _id: userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json({ message: `No user found with ID: ${userId}` });
        }
        res.json(removeVersionField(user));
      })
      .catch((err) => {
        console.error(
          `[${req.method} ${req.originalUrl}] Error updating user with ID: ${userId}`,
          err
        );
        res
          .status(500)
          .json({ message: "Failed to update user.", error: err.message });
      });
  },

  // Delete a user by ID
  deleteUser(req, res) {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    User.findOneAndDelete({ _id: userId })
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json({ message: `No user found with ID: ${userId}` });
        }
        return Thought.deleteMany({ _id: { $in: user.thoughts } })
          .then(() =>
            res.json({ message: "User and associated thoughts deleted!" })
          )
          .catch((err) => {
            console.error(
              `[${req.method} ${req.originalUrl}] Error deleting user's thoughts:`,
              err
            );
            res.status(500).json({
              message: "Failed to delete user's thoughts.",
              error: err.message,
            });
          });
      })
      .catch((err) => {
        console.error(
          `[${req.method} ${req.originalUrl}] Error deleting user with ID: ${userId}`,
          err
        );
        res
          .status(500)
          .json({ message: "Failed to delete user.", error: err.message });
      });
  },

  // Add a friend
  async addFriend(req, res) {
    const { userId, friendId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(friendId)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid user or friend ID format." });
    }

    try {
      const user = await User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { friends: friendId } },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: `No user found with ID: ${userId}` });
      }

      const friend = await User.findOneAndUpdate(
        { _id: friendId },
        { $addToSet: { friends: userId } },
        { new: true }
      );

      if (!friend) {
        return res
          .status(404)
          .json({ message: `No friend found with ID: ${friendId}` });
      }

      res.json({ message: "Friend added successfully!" });
    } catch (err) {
      console.error(
        `[${req.method} ${req.originalUrl}] Error adding friend:`,
        err
      );
      res
        .status(500)
        .json({ message: "Failed to add friend.", error: err.message });
    }
  },

  // Remove a friend
  async removeFriend(req, res) {
    const { userId, friendId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(friendId)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid user or friend ID format." });
    }

    try {
      const user = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { friends: friendId } },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: `No user found with ID: ${userId}` });
      }

      const friend = await User.findOneAndUpdate(
        { _id: friendId },
        { $pull: { friends: userId } },
        { new: true }
      );

      if (!friend) {
        return res
          .status(404)
          .json({ message: `No friend found with ID: ${friendId}` });
      }

      res.json({ message: "Friend removed successfully!" });
    } catch (err) {
      console.error(
        `[${req.method} ${req.originalUrl}] Error removing friend:`,
        err
      );
      res
        .status(500)
        .json({ message: "Failed to remove friend.", error: err.message });
    }
  },
};
