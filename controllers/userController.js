// Purpose: To control the CRUD operations for users and friends

// Import the User and Thought models
const { User, Thought } = require("../models");

// Export the user controller object with methods: getUsers, getSingleUser, createUser, updateUser, deleteUser, addFriend, and removeFriend
module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .select("_id username email thoughts friends") // Explicitly select fields in the desired order
      .then((users) => res.json(users))
      .catch((err) => {
        console.error("Error fetching users:", err); // Log the error
        res.status(500).json({
          message:
            "An error occurred while fetching users. Please try again later.",
          error: err.message,
        });
      });
  },

  // Get a single user by ID
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("_id username email thoughts friends") // Explicitly select fields in the desired order
      .populate("friends")
      .populate("thoughts")
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: `No user found with ID: ${req.params.userId}. Please verify the ID and try again.`,
          });
        }
        res.json(user);
      })
      .catch((err) => {
        console.error(`Error fetching user with ID: ${req.params.userId}`, err); // Log the error
        res.status(500).json({
          message:
            "An error occurred while fetching the user. Please try again later.",
          error: err.message,
        });
      });
  },

  // Create a new user
  createUser(req, res) {
    // Check if username or email already exists
    User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    })
      .then((existingUser) => {
        if (existingUser) {
          return res.status(400).json({
            message: `Username or email already exists. Please choose another.`,
            existingUser: {
              username: existingUser.username,
              email: existingUser.email,
            },
          });
        }

        // If no existing user, proceed to create the user
        return User.create(req.body)
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
              return res.status(400).json({
                message: "Validation failed. Please check the provided data.",
                errors: err.errors,
              });
            }

            // Log any other errors
            console.error("Server Error:", err);
            res.status(500).json({
              message:
                "An unexpected error occurred while creating the user. Please try again later.",
              error: err.message,
            });
          });
      })
      .catch((err) => {
        console.error("Error checking for existing user:", err);
        res.status(500).json({
          message:
            "An error occurred while checking for existing user. Please try again later.",
          error: err.message,
        });
      });
  },

  // Update a user by ID
  updateUser(req, res) {
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
      });
  },

  // Delete a user by ID
  deleteUser(req, res) {
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

  // Add a friend
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
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
      });
  },

  // Remove a friend
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
  },
};
