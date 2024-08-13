// Purpose: To control the CRUD operations for thoughts and reactions

const mongoose = require("mongoose"); // Import mongoose
const { Thought, User } = require("../models");

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => {
<<<<<<< HEAD
        console.error("Error fetching thoughts:", err);
        res.status(500).json({
          message:
            "An error occurred while fetching thoughts. Please try again later.",
          error: err.message,
        });
=======
        console.error(
          `[${req.method} ${req.originalUrl}] Error fetching thoughts:`,
          err
        );
        res
          .status(500)
          .json({ message: "Failed to fetch thoughts.", error: err.message });
>>>>>>> 678ac43 (fixed thoughtController.js, userController.js; added walkthrough video link to README.md)
      });
  },

  // Get a single thought by ID
  getSingleThought(req, res) {
<<<<<<< HEAD
    Thought.findOne({ _id: req.params.thoughtId })
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({
            message: `No thought found with ID: ${req.params.thoughtId}. Please verify the ID and try again.`,
          });
=======
    const thoughtId = req.params.thoughtId;

    if (!mongoose.Types.ObjectId.isValid(thoughtId)) {
      return res.status(400).json({ message: "Invalid thought ID format." });
    }

    Thought.findOne({ _id: thoughtId })
      .then((thought) => {
        if (!thought) {
          return res
            .status(404)
            .json({ message: `No thought found with ID: ${thoughtId}` });
>>>>>>> 678ac43 (fixed thoughtController.js, userController.js; added walkthrough video link to README.md)
        }
        res.json(thought);
      })
      .catch((err) => {
        console.error(
<<<<<<< HEAD
          `Error fetching thought with ID: ${req.params.thoughtId}`,
          err
        );
        res.status(500).json({
          message:
            "An error occurred while fetching the thought. Please try again later.",
          error: err.message,
        });
=======
          `[${req.method} ${req.originalUrl}] Error fetching thought with ID: ${thoughtId}`,
          err
        );
        res
          .status(500)
          .json({ message: "Failed to fetch thought.", error: err.message });
>>>>>>> 678ac43 (fixed thoughtController.js, userController.js; added walkthrough video link to README.md)
      });
  },

  // Create a new thought
  createThought(req, res) {
    const { userId, username } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    User.findById(userId)
      .then((user) => {
        if (!user) {
<<<<<<< HEAD
          return res.status(404).json({
            message: `No user found with ID: ${req.body.userId}. Cannot create thought without a valid user.`,
          });
=======
          return res
            .status(404)
            .json({ message: `No user found with ID: ${userId}` });
        }

        if (user.username !== username) {
          return res
            .status(400)
            .json({ message: "Username does not match the user ID." });
>>>>>>> 678ac43 (fixed thoughtController.js, userController.js; added walkthrough video link to README.md)
        }

        return Thought.create(req.body)
          .then((thought) => {
            return User.findOneAndUpdate(
              { _id: userId },
              { $addToSet: { thoughts: thought._id } },
              { new: true }
            );
          })
          .then(() =>
<<<<<<< HEAD
            res.status(201).json({ message: "Thought created successfully!", thought })
=======
            res.status(201).json({ message: "Thought created successfully!" })
>>>>>>> 678ac43 (fixed thoughtController.js, userController.js; added walkthrough video link to README.md)
          );
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
<<<<<<< HEAD
        console.error("Error creating thought:", err);
        res.status(500).json({
          message:
            "An unexpected error occurred while creating the thought. Please try again later.",
          error: err.message,
        });
=======

        console.error(
          `[${req.method} ${req.originalUrl}] Error creating thought:`,
          err
        );
        res
          .status(500)
          .json({ message: "Failed to create thought.", error: err.message });
>>>>>>> 678ac43 (fixed thoughtController.js, userController.js; added walkthrough video link to README.md)
      });
  },

  // Update a thought by ID
  updateThought(req, res) {
    const thoughtId = req.params.thoughtId;

    if (!mongoose.Types.ObjectId.isValid(thoughtId)) {
      return res.status(400).json({ message: "Invalid thought ID format." });
    }

    Thought.findOneAndUpdate(
      { _id: thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) => {
        if (!thought) {
<<<<<<< HEAD
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
=======
          return res
            .status(404)
            .json({ message: `No thought found with ID: ${thoughtId}` });
        }
        res.json(thought);
      })
      .catch((err) => {
        console.error(
          `[${req.method} ${req.originalUrl}] Error updating thought with ID: ${thoughtId}`,
          err
        );
        res
          .status(500)
          .json({ message: "Failed to update thought.", error: err.message });
>>>>>>> 678ac43 (fixed thoughtController.js, userController.js; added walkthrough video link to README.md)
      });
  },

  // Delete a thought by ID
  deleteThought(req, res) {
<<<<<<< HEAD
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
=======
    const thoughtId = req.params.thoughtId;

    if (!mongoose.Types.ObjectId.isValid(thoughtId)) {
      return res.status(400).json({ message: "Invalid thought ID format." });
    }

    Thought.findOneAndDelete({ _id: thoughtId })
      .then((thought) => {
        if (!thought) {
          return res
            .status(404)
            .json({ message: `No thought found with ID: ${thoughtId}` });
        }
        return User.findOneAndUpdate(
          { thoughts: thoughtId },
          { $pull: { thoughts: thoughtId } },
          { new: true }
        ).then(() => res.json({ message: "Thought successfully deleted!" }));
      })
      .catch((err) => {
        console.error(
          `[${req.method} ${req.originalUrl}] Error deleting thought with ID: ${thoughtId}`,
          err
        );
        res
          .status(500)
          .json({ message: "Failed to delete thought.", error: err.message });
>>>>>>> 678ac43 (fixed thoughtController.js, userController.js; added walkthrough video link to README.md)
      });
  },

  // Add a reaction to a thought
  addReaction(req, res) {
    const thoughtId = req.params.thoughtId;

    if (!mongoose.Types.ObjectId.isValid(thoughtId)) {
      return res.status(400).json({ message: "Invalid thought ID format." });
    }

    Thought.findOneAndUpdate(
      { _id: thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) => {
        if (!thought) {
<<<<<<< HEAD
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
=======
          return res
            .status(404)
            .json({ message: `No thought found with ID: ${thoughtId}` });
        }
        res.json(thought);
      })
      .catch((err) => {
        console.error(
          `[${req.method} ${req.originalUrl}] Error adding reaction to thought with ID: ${thoughtId}`,
          err
        );
        res
          .status(500)
          .json({ message: "Failed to add reaction.", error: err.message });
>>>>>>> 678ac43 (fixed thoughtController.js, userController.js; added walkthrough video link to README.md)
      });
  },

  // Remove a reaction from a thought
  removeReaction(req, res) {
    const { thoughtId, reactionId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(thoughtId) ||
      !mongoose.Types.ObjectId.isValid(reactionId)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid thought or reaction ID format." });
    }

    Thought.findOneAndUpdate(
      { _id: thoughtId },
      { $pull: { reactions: { reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) => {
        if (!thought) {
<<<<<<< HEAD
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
=======
          return res
            .status(404)
            .json({ message: `No thought found with ID: ${thoughtId}` });
        }
        res.json({ message: "Reaction removed successfully!" });
      })
      .catch((err) => {
        console.error(
          `[${req.method} ${req.originalUrl}] Error removing reaction from thought with ID: ${thoughtId}`,
          err
        );
        res
          .status(500)
          .json({ message: "Failed to remove reaction.", error: err.message });
>>>>>>> 678ac43 (fixed thoughtController.js, userController.js; added walkthrough video link to README.md)
      });
  },
};
