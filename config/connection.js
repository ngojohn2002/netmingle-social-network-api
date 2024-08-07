// Dependencies 
const mongoose = require("mongoose");

// Connect to the Mongo DB (social-network-api) using the MONGODB_URI environment variable. If it isn't available, use the local database. 
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/netmingle_social_network_db"
);

// Export the connection 
module.exports = mongoose.connection;
