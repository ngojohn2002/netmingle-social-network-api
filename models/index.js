// This is a simple index.js file that will import the User and Thought models and export them as an object. This will allow us to import all of our models with a single line of code in other files. For example, in controllers/thoughtController.js, we can import both models with a single line of code: const { Thought, User } = require("../models");. This is a common pattern in Node.js applications, and it's a good practice to follow because it keeps our code organized and easy to maintain. If we add more models to our application in the future, we can simply import them in this file and export them as part of the object. This makes it easy to manage all of our models in one place and import them wherever we need them in our application.

// Dependencies
const User = require("./User");
const Thought = require("./Thought");

// Export the User and Thought models as an object
module.exports = { User, Thought };
