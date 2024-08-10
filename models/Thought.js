// Purpose: Create a Thought model using Mongoose. This model will be used to interact with the thoughts collection in the NoSQL database. The Thought model will include the following fields: thoughtText, createdAt, username, and reactions. The reactions field will be an array of nested documents created with the reactionSchema. The reactionSchema will include the fields reactionId, reactionBody, username, and createdAt. The Thought model will also include a virtual called reactionCount that retrieves the length of the thought's reactions array field on query. The Thought model will be exported from this file and imported into the thought controller. The thought controller will use the Thought model to perform CRUD operations on the thoughts collection in the database. 

// Dependencies 
const { Schema, model, Types } = require("mongoose");

// Reaction schema to be used as a subdocument in the Thought model 
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => new Date(timestamp).toLocaleString(),
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

// Thought schema to be used as a model in the application 
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => new Date(timestamp).toLocaleString(),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// Virtual to retrieve the length of the thought's reactions array field on query 
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

// Create the Thought model using the thoughtSchema 
const Thought = model("Thought", thoughtSchema);

// Export the Thought model
module.exports = Thought;
