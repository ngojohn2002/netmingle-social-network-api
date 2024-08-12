// Purpose: To control the CRUD operations for thoughts and reactions

// Import the Thought and User models
const { Thought, User } = require("../models");

// Export the thought controller object with methods: getThoughts, getSingleThought, createThought, updateThought, deleteThought, addReaction, and removeReaction
module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => {
        console.error("Error fetching thoughts:", err);
        res.status(500).json({
          message:
            "An error occurred while fetching thoughts. Please try again later.",
          error: err.message,
        });
      });
  },

  // Get a single thought by ID
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({
            message: `No thought found with ID: ${req.params.thoughtId}. Please verify the ID and try again.`,
          });
        }
        res.json(thought);
      })
      .catch((err) => {
        console.error(
          `Error fetching thought with ID: ${req.params.thoughtId}`,
          err
        );
        res.status(500).json({
          message:
            "An error occurred while fetching the thought. Please try again later.",
          error: err.message,
        });
      });
  },

  // The createThought method will first find the user by ID and then create the thought. If the user exists, the thought will be created and the thought's ID will be added to the user's thoughts array. If the user does not exist, a 404 status will be returned with a message indicating that no user was found with that ID. If the validation fails, a 400 status will be returned with a message indicating that validation failed and the errors that occurred. If any other type of error occurs, a 500 status will be returned with the error message.
  // Create a new thought
  createThought(req, res) {
    // First, find the user by ID
    User.findById(req.body.userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: `No user found with ID: ${req.body.userId}. Cannot create thought without a valid user.`,
          });
        }

        // If the user exists, create the thought
        return Thought.create(req.body)
          .then((thought) => {
            // Add the thought's ID to the user's thoughts array
            return User.findOneAndUpdate(
              { _id: req.body.userId },
              { $addToSet: { thoughts: thought._id } },
              { new: true }
            );
          })
          .then(() =>
            res.status(201).json({ message: "Thought created successfully!", thought })
          );
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          console.error("Validation Error:", err);
          return res.status(400).json({
            message: "Validation failed. Please check the provided data.",
            errors: err.errors,
          });
        }
        console.error("Error creating thought:", err);
        res.status(500).json({
          message:
            "An unexpected error occurred while creating the thought. Please try again later.",
          error: err.message,
        });
      });
  },

  // Update a thought by ID
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({
            message: `No thought found with ID: ${req.params.thoughtId}. Please verify the ID and try again.`,
          });
        }
        res.json({
          message: "Thought updated successfully!",
          thought,
        });
      })
      .catch((err) => {
        console.error(
          `Error updating thought with ID: ${req.params.thoughtId}`,
          err
        );
        res.status(500).json({
          message:
            "An error occurred while updating the thought. Please try again later.",
          error: err.message,
        });
      });
  },

  // Delete a thought by ID
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({
            message: `No thought found with ID: ${req.params.thoughtId}. Please verify the ID and try again.`,
          });
        }
        return User.findOneAndUpdate(
          { thoughts: req.params.thoughtId },
          { $pull: { thoughts: req.params.thoughtId } },
          { new: true }
        );
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: `Thought deleted but no associated user found with ID: ${req.params.userId}.`,
          });
        }
        res.json({
          message: "Thought and associated user data updated successfully!",
        });
      })
      .catch((err) => {
        console.error(
          `Error deleting thought with ID: ${req.params.thoughtId}`,
          err
        );
        res.status(500).json({
          message:
            "An error occurred while deleting the thought. Please try again later.",
          error: err.message,
        });
      });
  },

  // Add a reaction to a thought
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({
            message: `No thought found with ID: ${req.params.thoughtId}. Please verify the ID and try again.`,
          });
        }
        res.json({ message: "Reaction added successfully!", thought });
      })
      .catch((err) => {
        console.error(
          `Error adding reaction to thought with ID: ${req.params.thoughtId}`,
          err
        );
        res.status(500).json({
          message:
            "An error occurred while adding the reaction. Please try again later.",
          error: err.message,
        });
      });
  },

  // Remove a reaction from a thought
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({
            message: `No thought found with ID: ${req.params.thoughtId}. Please verify the ID and try again.`,
          });
        }

        // Check if the reaction was removed from the thought document or not found in the thought document at all (i.e., no reaction with that reactionId) and return a 404 status with a message if so
        const reactionRemoved = thought.reactions.some(
          (reaction) => reaction.reactionId.toString() === req.params.reactionId
        );

        if (!reactionRemoved) {
          return res
            .status(404)
            .json({
              message: "No reaction found with this ID in the thought!",
            });
        }

        res.json({ message: "Reaction removed successfully!", thought });
      })
      .catch((err) => {
        console.error(
          `Error removing reaction from thought with ID: ${req.params.thoughtId}`,
          err
        );
        res.status(500).json({
          message:
            "An error occurred while removing the reaction. Please try again later.",
          error: err.message,
        });
      });
  },
};
