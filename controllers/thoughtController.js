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
        res.status(500).json(err);
      });
  },

  // Get a single thought by ID
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(thought)
      )
      .catch((err) => {
        console.error("Error fetching thought:", err);
        res.status(500).json(err);
      });
  },

  // The createThought method will first find the user by ID and then create the thought. If the user exists, the thought will be created and the thought's ID will be added to the user's thoughts array. If the user does not exist, a 404 status will be returned with a message indicating that no user was found with that ID. If the validation fails, a 400 status will be returned with a message indicating that validation failed and the errors that occurred. If any other type of error occurs, a 500 status will be returned with the error message.
  // Create a new thought
  createThought(req, res) {
    // First, find the user by ID
    User.findById(req.body.userId)
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json({ message: "No user found with that ID" });
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
          .then(() => res.json("Created the thought 🎉"));
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          console.error("Validation Error:", err);
          return res.status(400).json({
            message: "Validation failed",
            errors: err.errors,
          });
        }
        console.error("Error creating thought:", err);
        res.status(500).json(err);
      });
  },

  // Update a thought by ID
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with this ID!" })
          : res.json(thought)
      )
      .catch((err) => {
        console.error("Error updating thought:", err);
        res.status(500).json(err);
      });
  },

  // Delete a thought by ID
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with this ID!" })
          : User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: "Thought deleted but no user with this id!" })
          : res.json({ message: "Thought successfully deleted!" })
      )
      .catch((err) => {
        console.error("Error deleting thought:", err);
        res.status(500).json(err);
      });
  },

  // Add a reaction to a thought
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with this ID!" })
          : res.json(thought)
      )
      .catch((err) => {
        console.error("Error adding reaction:", err);
        res.status(500).json(err);
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
          return res.status(404).json({ message: "No thought with this ID!" });
        }

        // Check if the reaction was removed from the thought document or not found in the thought document at all (i.e., no reaction with that reactionId) and return a 404 status with a message if so
        const reactionRemoved = thought.reactions.some(
          (reaction) => reaction.reactionId.toString() === req.params.reactionId
        );

        if (!reactionRemoved) {
          return res
            .status(404)
            .json({ message: "No reaction with this id in the thought!" });
        }

        return res.json(thought);
      })
      .catch((err) => {
        console.error("Error removing reaction:", err);
        res.status(500).json(err);
      });
  },
};
