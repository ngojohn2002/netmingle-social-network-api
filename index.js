// Purpose: Entry point for the server to start the application. This file will import the express server and set up the server. The server will be used to create the API endpoint and import the API routes. The API routes will be used to perform CRUD operations on the users and thoughts collections in the database. The API routes will be exported from this file and imported into the server.js file to be used in the application.

// Import express server
const express = require("express");

// Import the database connection
const db = require("./config/connection");

// Import the routes
const routes = require("./routes");

// Create the express server
const app = express();

// Set the port for the server
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

// Middleware for handling errors in routes
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message });
});

// Start the Express server only after the database connection is established
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server for social network running on port ${PORT}!`);
  });
});

// Graceful shutdown on SIGINT (e.g., when the application is terminated via Ctrl+C)
process.on("SIGINT", async () => {
  console.log("SIGINT received: closing MongoDB connection");
  await db.close();
  console.log("MongoDB connection closed. Shutting down server.");
  process.exit(0);
});
