// Purpose: to create the routes for the thoughts API endpoints. The thoughtRoutes.js file will contain the routes for performing CRUD operations on the thoughts collection in the database. The thoughtRoutes.js file will be used to create the /api/thoughts endpoint, which will be used to perform CRUD operations on the thoughts collection in the database. The thoughtRoutes.js file will be exported from this file and imported into the routes/api/index.js file to be used in the application. 
 
// Import the express Router object and the CRUD methods from the thoughtController.js file 
const router = require("express").Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require("../../controllers/thoughtController");

// Route to get all thoughts and create a new thought
router // /api/thoughts 
  .route("/") // GET all thoughts and POST a new thought
  .get(getThoughts) // GET all thoughts 
  .post(createThought); // POST a new thought 

// Route to get, update, or delete a single thought by ID
router // /api/thoughts/:thoughtId
  .route("/:thoughtId") // GET, PUT, and DELETE a thought by ID
  .get(getSingleThought) // GET a single thought by ID
  .put(updateThought) // PUT update a thought by ID
  .delete(deleteThought); // DELETE a thought by ID

// Route to add a reaction to a thought
router // /api/thoughts/:thoughtId/reactions
  .route("/:thoughtId/reactions") 
  .post(addReaction); 

// Route to remove a reaction from a thought

router // /api/thoughts/:thoughtId/reactions/:reactionId
  .route("/:thoughtId/reactions/:reactionId")
  .delete(removeReaction); 

// Export the router 
module.exports = router;
