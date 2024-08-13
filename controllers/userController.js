// Purpose: To control the CRUD operations for users and friends

// Import the User and Thought models
const { User, Thought } = require("../models");

// Export the user controller object with methods: getUsers, getSingleUser, createUser, updateUser, deleteUser, addFriend, and removeFriend
module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .select("-__v") // Exclude the __v field from the results
      .then((users) => res.json(users))
      .catch((err) => {
        console.error("Error fetching users:", err); // Log the error
        res.status(500).json({
          message: "Failed to retrieve users. Please try again later.",
          error: err.message,
        });
      });
  },

  // Get a single user by ID
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v") // Exclude the __v field from the result
      .populate("friends")
      .populate("thoughts")
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "No user with that ID" });
        }
        res.json(user);
      })
      .catch((err) => {
        console.error("Error fetching user:", err); // Log the error
        res.status(500).json({
          message: "Failed to retrieve the user. Please try again later.",
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
          });
        }

        // If no existing user, proceed to create the user
        return User.create(req.body)
          .then((user) => res.json(user))
          .catch((err) => {
            if (err.name === "ValidationError") {
              console.error("Validation Error:", err);
              return res.status(400).json({
                message: "Validation failed. Please check the provided data.",
                errors: err.errors,
              });
            }

            console.error("Server Error:", err);
            res.status(500).json({
              message: "An unexpected error occurred. Please try again later.",
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
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "No user with this ID!" });
        }
        res.json(user);
      })
      .catch((err) => {
        console.error("Error updating user:", err); // Log the error
        res.status(500).json({
          message: "Failed to update the user. Please try again later.",
          error: err.message,
        });
      });
  },

  // Delete a user by ID
deleteUser(req, res) {
  User.findOneAndDelete({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "No user with this ID" });
      }
      
      // Remove the user's ID from all friends lists
      return User.updateMany(
        { friends: req.params.userId },
        { $pull: { friends: req.params.userId } }
      )
      .then(() => Thought.deleteMany({ _id: { $in: user.thoughts } }))
      .then(() => res.json({ message: "User and associated thoughts deleted, and friends updated!" }));
    })
    .catch((err) => {
      console.error("Error deleting user:", err);
      if (!res.headersSent) {
        res.status(500).json({
          message: "Failed to delete the user. Please try again later.",
          error: err.message,
        });
      }
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
          return res.status(404).json({ message: "No user with this ID!" });
        }
        return User.findOneAndUpdate(
          { _id: req.params.friendId },
          { $addToSet: { friends: req.params.userId } },
          { new: true }
        );
      })
      .then((friend) => {
        if (!friend) {
          return res
            .status(404)
            .json({ message: "No user with this friend ID!" });
        }
        res.json({ message: "Friend added successfully!" });
      })
      .catch((err) => {
        console.error("Error adding friend:", err); // Log the error
        res.status(500).json({
          message: "Failed to add the friend. Please try again later.",
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
          return res.status(404).json({ message: "No user with this ID!" });
        }
        return User.findOneAndUpdate(
          { _id: req.params.friendId },
          { $pull: { friends: req.params.userId } },
          { new: true }
        );
      })
      .then((friend) => {
        if (!friend) {
          return res
            .status(404)
            .json({ message: "No user with this friend ID!" });
        }
        res.json({ message: "Friend removed successfully!" });
      })
      .catch((err) => {
        console.error("Error removing friend:", err); // Log the error
        res.status(500).json({
          message: "Failed to remove the friend. Please try again later.",
          error: err.message,
        });
      });
  },
};
