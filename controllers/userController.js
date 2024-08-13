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
<<<<<<< HEAD
      .select("_id username email thoughts friends") // Explicitly select fields in the desired order
      .then((users) => res.json(users))
      .catch((err) => {
        console.error("Error fetching users:", err); // Log the error
        res.status(500).json({
          message:
            "An error occurred while fetching users. Please try again later.",
          error: err.message,
        });
=======
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
>>>>>>> 678ac43 (fixed thoughtController.js, userController.js; added walkthrough video link to README.md)
      });
  },

  // Get a single user by ID
  getSingleUser(req, res) {
<<<<<<< HEAD
    User.findOne({ _id: req.params.userId })
      .select("_id username email thoughts friends") // Explicitly select fields in the desired order
      .populate("friends")
      .populate("thoughts")
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: `No user found with ID: ${req.params.userId}. Please verify the ID and try again.`,
          });
=======
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
>>>>>>> 678ac43 (fixed thoughtController.js, userController.js; added walkthrough video link to README.md)
        }
        res.json(removeVersionField(user));
      })
      .catch((err) => {
<<<<<<< HEAD
        console.error(`Error fetching user with ID: ${req.params.userId}`, err); // Log the error
        res.status(500).json({
          message:
            "An error occurred while fetching the user. Please try again later.",
          error: err.message,
        });
=======
        console.error(
          `[${req.method} ${req.originalUrl}] Error fetching user with ID: ${userId}`,
          err
        );
        res
          .status(500)
          .json({ message: "Failed to fetch user.", error: err.message });
>>>>>>> 678ac43 (fixed thoughtController.js, userController.js; added walkthrough video link to README.md)
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
<<<<<<< HEAD
            message: `Username or email already exists. Please choose another.`,
            existingUser: {
              username: existingUser.username,
              email: existingUser.email,
            },
=======
            message: "Username or email already exists. Please choose another.",
>>>>>>> 678ac43 (fixed thoughtController.js, userController.js; added walkthrough video link to README.md)
          });
        }

        return User.create(req.body)
<<<<<<< HEAD
          .then((user) =>
            res.status(201).json({
              message: "User created successfully!",
              user,
            })
          )
          .catch((err) => {
            if (err.name === "ValidationError") {
              // Log the validation error for debugging
              console.error("Validation Error:", err);
=======
          .then((user) => {
            res.status(201).json(removeVersionField(user));
          })
          .catch((err) => {
            if (err.name === "ValidationError") {
              console.error(
                `[${req.method} ${req.originalUrl}] Validation Error:`,
                err
              );
>>>>>>> 678ac43 (fixed thoughtController.js, userController.js; added walkthrough video link to README.md)
              return res.status(400).json({
                message: "Validation failed. Please check the provided data.",
                errors: err.errors,
              });
            }

<<<<<<< HEAD
            // Log any other errors
            console.error("Server Error:", err);
            res.status(500).json({
              message:
                "An unexpected error occurred while creating the user. Please try again later.",
              error: err.message,
            });
=======
            console.error(
              `[${req.method} ${req.originalUrl}] Error creating user:`,
              err
            );
            res
              .status(500)
              .json({ message: "Failed to create user.", error: err.message });
>>>>>>> 678ac43 (fixed thoughtController.js, userController.js; added walkthrough video link to README.md)
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
<<<<<<< HEAD
    // Validate userId and username consistency
    User.findOne({ _id: req.params.userId, username: req.body.username })
      .then((user) => {
        if (!user) {
          return res.status(400).json({
            message: `Mismatch or no user found with ID: ${req.params.userId} and username: ${req.body.username}. Please verify and try again.`,
          });
        }

        // Proceed with the update
        return User.findOneAndUpdate(
          { _id: req.params.userId },
          { $set: req.body },
          { runValidators: true, new: true }
        );
      })
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).json({
            message: `No user found with ID: ${req.params.userId}. Please verify the ID and try again.`,
          });
        }
        res.json({
          message: "User updated successfully!",
          updatedUser,
        });
      })
      .catch((err) => {
        console.error(`Error updating user with ID: ${req.params.userId}`, err); // Log the error
        res.status(500).json({
          message:
            "An error occurred while updating the user. Please try again later.",
          error: err.message,
        });
=======
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
>>>>>>> 678ac43 (fixed thoughtController.js, userController.js; added walkthrough video link to README.md)
      });
  },

  // Delete a user by ID
  deleteUser(req, res) {
<<<<<<< HEAD
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: `No user found with ID: ${req.params.userId}. Please verify the ID and try again.`,
          });
        }
        // Delete associated thoughts
        return Thought.deleteMany({ _id: { $in: user.thoughts } });
      })
      .then(() =>
        res.json({
          message: "User and associated thoughts deleted successfully!",
        })
      )
      .catch((err) => {
        console.error(`Error deleting user with ID: ${req.params.userId}`, err); // Log the error
        res.status(500).json({
          message:
            "An error occurred while deleting the user. Please try again later.",
          error: err.message,
        });
      });
  },
=======
    const userId = req.params.userId;
>>>>>>> 678ac43 (fixed thoughtController.js, userController.js; added walkthrough video link to README.md)

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    User.findOneAndDelete({ _id: userId })
      .then((user) => {
        if (!user) {
<<<<<<< HEAD
          return res.status(404).json({
            message: `No user found with ID: ${req.params.userId}. Please verify the ID and try again.`,
          });
        }
        return User.findOneAndUpdate(
          { _id: req.params.friendId },
          { $addToSet: { friends: req.params.userId } },
          { new: true }
        );
      })
      .then((friend) => {
        if (!friend) {
          return res.status(404).json({
            message: `No friend found with ID: ${req.params.friendId}. Please verify the ID and try again.`,
          });
        }
        res.json({
          message: "Friend added successfully!",
          userId: req.params.userId,
          friendId: req.params.friendId,
        });
      })
      .catch((err) => {
        console.error(
          `Error adding friend with ID: ${req.params.friendId} to user with ID: ${req.params.userId}`,
          err
        ); // Log the error
        res.status(500).json({
          message:
            "An error occurred while adding the friend. Please try again later.",
          error: err.message,
        });
=======
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
>>>>>>> 678ac43 (fixed thoughtController.js, userController.js; added walkthrough video link to README.md)
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
<<<<<<< HEAD
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: `No user found with ID: ${req.params.userId}. Please verify the ID and try again.`,
          });
        }
        return User.findOneAndUpdate(
          { _id: req.params.friendId },
          { $pull: { friends: req.params.userId } },
          { new: true }
        );
      })
      .then((friend) => {
        if (!friend) {
          return res.status(404).json({
            message: `No friend found with ID: ${req.params.friendId}. Please verify the ID and try again.`,
          });
        }
        res.json({
          message: "Friend removed successfully!",
          userId: req.params.userId,
          friendId: req.params.friendId,
        });
      })
      .catch((err) => {
        console.error(
          `Error removing friend with ID: ${req.params.friendId} from user with ID: ${req.params.userId}`,
          err
        ); // Log the error
        res.status(500).json({
          message:
            "An error occurred while removing the friend. Please try again later.",
          error: err.message,
        });
      });
=======
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
>>>>>>> 678ac43 (fixed thoughtController.js, userController.js; added walkthrough video link to README.md)
  },
};
