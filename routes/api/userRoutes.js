// Purpose: This file is the route handler for the user routes. The user routes will be used to perform CRUD operations on the users collection in the database. The user routes will be used to create, read, update, and delete users in the database. The user routes will be used to create the /api/users endpoint. The /api/users endpoint will be used to perform CRUD operations on the users collection in the database. The user routes will be exported from this file and imported into the routes/api/index.js file to be used in the application. 

// Import the express router 
const router = require("express").Router();

// Import the CRUD methods from the userController.js file 
const {
  getUsers, 
  getSingleUser, 
  createUser, 
  updateUser, 
  deleteUser,
  addFriend,
  removeFriend,
} = require("../../controllers/userController");

// /api/users GET and POST routes for getting all users and creating a user respectively 
router
  .route("/") // GET and POST all users
  .get(getUsers) // GET all users 
  .post(createUser); // POST a new user 

// /api/users/:userId GET, PUT, and DELETE routes for getting a single user, updating a user, and deleting a user respectively 
router
  .route("/:userId") // GET, PUT, and DELETE a user by ID
  .get(getSingleUser) // GET a single user by ID
  .put(updateUser) // PUT update a user by ID
  .delete(deleteUser); // DELETE a user by ID

// /api/users/:userId/friends/:friendId POST and DELETE routes for adding a friend to a user's friend list and removing a friend from a user's friend list respectively 
router
  .route("/:userId/friends/:friendId") // POST and DELETE a friend to a user's friend list 
  .post(addFriend) // POST add a friend to a user's friend list 
  .delete(removeFriend); // DELETE remove a friend from a user's friend list 

// Export the router 
module.exports = router;
