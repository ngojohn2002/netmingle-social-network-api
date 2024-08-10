// Purpose: Establish a connection to the MongoDB database using Mongoose.

// Dependencies
const mongoose = require("mongoose");

// Connect to the MongoDB (netmingle-social-network-db) using the MONGODB_URI environment variable.
// If the environment variable isn't available, fall back to the local database.
mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb://localhost:27017/netmingle-social-network-db"
);

// Event listener for successful connection
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB successfully!");
});

// Event listener for connection error
mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

// Event listener for disconnection
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected. Attempting to reconnect...");
});

// Event listener for successful reconnection
mongoose.connection.on("reconnected", () => {
  console.log("Reconnected to MongoDB successfully!");
});

// Event listener for failed reconnection attempts
mongoose.connection.on("reconnectFailed", () => {
  console.error(
    "MongoDB reconnection attempts failed. Please check your connection."
  );
});

// Closing the connection when the Node.js process ends
// This ensures that the MongoDB connection is properly closed when the application is terminated,
// preventing potential data corruption or leaving connections open.
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination");
  process.exit(0);
});

// Export the connection
module.exports = mongoose.connection;
