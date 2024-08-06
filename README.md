# Social Network API

## Description

This project is an API for a social network web application where users can share their thoughts, react to friends' thoughts, and create a friend list. The API is built using Node.js, Express.js, and MongoDB with Mongoose ODM.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Models](#models)
- [Walkthrough Video](#walkthrough-video)
- [License](#license)

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-username/social-network-api.git
   cd social-network-api
   ```

2. **Install the dependencies:**

   ```sh
   npm install
   ```

3. **Ensure MongoDB is running on your machine.** You can download and install MongoDB from [here](https://www.mongodb.com/try/download/community).

4. **Start the server:**

   ```sh
   npm run dev
   ```

## Usage

Once the server is running, you can use Insomnia, Postman, or any other API client to interact with the API. The API base URL is `http://localhost:3001/api`.

### Example Requests

- **GET all users:** `GET /api/users`
- **GET a single user by ID:** `GET /api/users/:userId`
- **POST a new user:** `POST /api/users`
- **PUT update a user by ID:** `PUT /api/users/:userId`
- **DELETE a user by ID:** `DELETE /api/users/:userId`

Refer to the [API Endpoints](#api-endpoints) section for more details on available endpoints and their usage.

## API Endpoints

### Users

- **GET /api/users**
  - Get all users

- **GET /api/users/:userId**
  - Get a single user by ID
  - Example: `GET /api/users/60d0fe4f5311236168a109ca`

- **POST /api/users**
  - Create a new user
  - Example request body:
    ```json
    {
      "username": "user1",
      "email": "user1@example.com"
    }
    ```

- **PUT /api/users/:userId**
  - Update a user by ID
  - Example: `PUT /api/users/60d0fe4f5311236168a109ca`
  - Example request body:
    ```json
    {
      "username": "updatedUser",
      "email": "updatedUser@example.com"
    }
    ```

- **DELETE /api/users/:userId**
  - Delete a user by ID
  - Example: `DELETE /api/users/60d0fe4f5311236168a109ca`

- **POST /api/users/:userId/friends/:friendId**
  - Add a friend to a user's friend list
  - Example: `POST /api/users/60d0fe4f5311236168a109ca/friends/60d0fe4f5311236168a109cb`

- **DELETE /api/users/:userId/friends/:friendId**
  - Remove a friend from a user's friend list
  - Example: `DELETE /api/users/60d0fe4f5311236168a109ca/friends/60d0fe4f5311236168a109cb`

### Thoughts

- **GET /api/thoughts**
  - Get all thoughts

- **GET /api/thoughts/:thoughtId**
  - Get a single thought by ID
  - Example: `GET /api/thoughts/60d0fe4f5311236168a109cc`

- **POST /api/thoughts**
  - Create a new thought
  - Example request body:
    ```json
    {
      "thoughtText": "This is a thought",
      "username": "user1",
      "userId": "60d0fe4f5311236168a109ca"
    }
    ```

- **PUT /api/thoughts/:thoughtId**
  - Update a thought by ID
  - Example: `PUT /api/thoughts/60d0fe4f5311236168a109cc`
  - Example request body:
    ```json
    {
      "thoughtText": "Here's an updated thought..."
    }
    ```

- **DELETE /api/thoughts/:thoughtId**
  - Delete a thought by ID
  - Example: `DELETE /api/thoughts/60d0fe4f5311236168a109cc`

- **POST /api/thoughts/:thoughtId/reactions**
  - Add a reaction to a thought
  - Example: `POST /api/thoughts/60d0fe4f5311236168a109cc/reactions`
  - Example request body:
    ```json
    {
      "reactionBody": "Great thought!",
      "username": "user2"
    }
    ```

- **DELETE /api/thoughts/:thoughtId/reactions/:reactionId**
  - Remove a reaction from a thought
  - Example: `DELETE /api/thoughts/60d0fe4f5311236168a109cc/reactions/60d0fe4f5311236168a109cd`

## Models

### User

```json
{
  "username": "String (unique, required, trimmed)",
  "email": "String (required, unique, must match a valid email address)",
  "thoughts": "Array of _id values referencing the Thought model",
  "friends": "Array of _id values referencing the User model (self-reference)"
}
```

### Thought

```json
{
  "thoughtText": "String (required, must be between 1 and 280 characters)",
  "createdAt": "Date (default: current timestamp, uses getter method to format timestamp)",
  "username": "String (required)",
  "reactions": "Array of nested documents created with the reactionSchema"
}
```

### Reaction (Schema Only)

```json
{
  "reactionId": "ObjectId (default: new ObjectId)",
  "reactionBody": "String (required, 280 character maximum)",
  "username": "String (required)",
  "createdAt": "Date (default: current timestamp, uses getter method to format timestamp)"
}
```

## Walkthrough Video

[Link to walkthrough video demonstrating the functionality of the application](#)

## License

This project is licensed under the MIT License.