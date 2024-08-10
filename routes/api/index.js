// Purpose: This file serves as the central hub for managing the application's routing logic. It imports the express.Router object and all of the API routes from the userRoutes.js and thoughtRoutes.js files to be used in the application. The userRoutes.js file contains the routes for performing CRUD operations on the users collection in the database. The thoughtRoutes.js file contains the routes for performing CRUD operations on the thoughts collection in the database. The userRoutes.js and thoughtRoutes.js files will be used to create the /api/users and /api/thoughts endpoints, respectively. The /api/users endpoint will be used to perform CRUD operations on the users collection in the database. The /api/thoughts endpoint will be used to perform CRUD operations on the thoughts collection in the database. The /api/users and /api/thoughts endpoints will be used to create, read, update, and delete users and thoughts in the database. The /api/users and /api/thoughts endpoints will be exported from this file and imported into the server.js file to be used in the application.

// Dependencies 
const router = require("express").Router();
const userRoutes = require("./userRoutes");
const thoughtRoutes = require("./thoughtRoutes");

// Use the userRoutes and thoughtRoutes 
router.use("/users", userRoutes);
router.use("/thoughts", thoughtRoutes);

// Export the router
module.exports = router;
