// Purpose: User model for the social network API that will include the following fields: username, email, thoughts, and friends. The thoughts field will be an array of ObjectId values referencing the Thought model. The friends field will be an array of ObjectId values referencing the User model (self-reference). The User model will also include a virtual called friendCount that retrieves the length of the user's friends array field on query. The User model will be exported from this file and imported into the user controller. The user controller will use the User model to perform CRUD operations on the users collection in the database. 

// Dependencies 
const { Schema, model } = require("mongoose");

// User schema to be used as a model in the application 
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Must match a valid email address'],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Virtual that retrieves the length of the user's friends array field on query 
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

// Create the User model using the userSchema 
const User = model("User", userSchema);

// Export the User model 
module.exports = User;
