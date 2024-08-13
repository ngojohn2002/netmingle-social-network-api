// Purpose: To control the CRUD operations for thoughts and reactions

const mongoose = require("mongoose"); // Import mongoose
const { Thought, User } = require("../models");

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => {
        console.error(
          `[${req.method} ${req.originalUrl}] Error fetching thoughts:`,
          err
        );
        res
          .status(500)
          .json({ message: "Failed to fetch thoughts.", error: err.message });
      });
  },

  // Get a single thought by ID
  getSingleThought(req, res) {
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
        }
        res.json(thought);
      })
      .catch((err) => {
        console.error(
          `[${req.method} ${req.originalUrl}] Error fetching thought with ID: ${thoughtId}`,
          err
        );
        res
          .status(500)
          .json({ message: "Failed to fetch thought.", error: err.message });
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
          return res
            .status(404)
            .json({ message: `No user found with ID: ${userId}` });
        }

        if (user.username !== username) {
          return res
            .status(400)
            .json({ message: "Username does not match the user ID." });
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
            res.status(201).json({ message: "Thought created successfully!" })
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

        console.error(
          `[${req.method} ${req.originalUrl}] Error creating thought:`,
          err
        );
        res
          .status(500)
          .json({ message: "Failed to create thought.", error: err.message });
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
      });
  },

  // Delete a thought by ID
  deleteThought(req, res) {
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
      });
  },
};
