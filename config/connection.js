// Dependencies 
const mongoose = require("mongoose");

// Connect to the Mongo DB (social-network-api) using the MONGODB_URI environment variable. If it isn't available, use the local database. 
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/social-network-api"
);

// Export the connection 
module.exports = mongoose.connection;
