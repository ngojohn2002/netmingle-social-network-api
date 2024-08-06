// Import the express router 
const router = require("express").Router();

// Import the user controller methods here to assign to the proper route endpoints in the userRoutes.js file in the routes/api/ directory. The methods you'll need to import are getUsers, getSingleUser, createUser, updateUser, deleteUser, addFriend, and removeFriend. You'll also need to import the User model. You'll use the User model to perform the necessary database queries in these methods. You'll also need to import the User model to perform the necessary database queries in these methods. 
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
router.route("/").get(getUsers).post(createUser);

// /api/users/:userId GET, PUT, and DELETE routes for getting a single user, updating a user, and deleting a user respectively 
router.route("/:userId").get(getSingleUser).put(updateUser).delete(deleteUser);

// /api/users/:userId/friends/:friendId POST and DELETE routes for adding a friend to a user's friend list and removing a friend from a user's friend list respectively 
router.route("/:userId/friends/:friendId").post(addFriend).delete(removeFriend);

// Export the router 
module.exports = router;
