// This file is the entry point for the routes. It will import the API routes and set up the router.
// The router will be used to create the /api endpoint and import the API routes.
// The /api endpoint will be used to perform CRUD operations on the users and thoughts collections in the database.
// The API routes will be exported from this file and imported into the server.js file to be used in the application.

// Dependencies
const router = require("express").Router();
const apiRoutes = require("./api");

// API routes
router.use("/api", apiRoutes);

// Error handling for undefined routes
router.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message:
      "The requested route does not exist. Please check the URL and try again.",
  });
});

// Export the router
module.exports = router;
