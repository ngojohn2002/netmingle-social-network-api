# NetMingle: Social Network API

![MIT License](https://img.shields.io/badge/license-MIT-green) ![Node.js](https://img.shields.io/badge/node.js-v14.17.3-blue) ![Express](https://img.shields.io/badge/express-v4.17.1-lightgrey) ![MongoDB](https://img.shields.io/badge/mongodb-v4.4.6-brightgreen)

NetMingle is an API for a social network web application where users can share their thoughts, react to friends' thoughts, and create a friend list. Built using Node.js, Express.js, and MongoDB with Mongoose ODM, this project was part of the curriculum for the edX Boot Camps LLC.

### User Story

```md
AS A social media startup
I WANT an API for my social network that uses a NoSQL database
SO THAT my website can handle large amounts of unstructured data
```

### Acceptance Criteria

```md
GIVEN a social network API
WHEN I enter the command to invoke the application
THEN my server is started and the Mongoose models are synced to the MongoDB database
WHEN I open API GET routes in Insomnia for users and thoughts
THEN the data for each of these routes is displayed in a formatted JSON
WHEN I test API POST, PUT, and DELETE routes in Insomnia
THEN I am able to successfully create, update, and delete users and thoughts in my database
WHEN I test API POST and DELETE routes in Insomnia
THEN I am able to successfully create and delete reactions to thoughts and add and remove friends to a user’s friend list
```

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
  - [Users](#users)
  - [Thoughts](#thoughts)
  - [Friends](#friends)
  - [Reactions](#reactions)
- [Models](#models)
- [Walkthrough Video](#walkthrough-video)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)

## Features

- User authentication and management
- Create, update, and delete users
- Create, update, and delete thoughts
- Add and remove reactions to thoughts
- Add and remove friends
- Timestamps for thoughts and reactions
- Input validation for email addresses and usernames

[Back to Table of Contents](#table-of-contents)

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Insomnia

[Back to Table of Contents](#table-of-contents)

## Getting Started

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/ngojohn2002/social-network-api.git
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

### Usage

Once the server is running, you can use Insomnia, Postman, or any other API client to interact with the API. The API base URL is `http://localhost:3001/api`.

Refer to the [API Endpoints](#api-endpoints) section for more details on available endpoints and their usage.

[Back to Table of Contents](#table-of-contents)

## API Endpoints

### Users

- **Create a new user**
  - **Request:**
    ```
    POST /api/users
    ```
  - **Request Body:**
    ```json
    {
      "username": "user1",
      "email": "user1@example.com"
    }
    ```
  - **Response:**
    ```json
    {
      "_id": "60d0fe4f5311236168a109ca",
      "username": "user1",
      "email": "user1@example.com",
      "thoughts": [],
      "friends": [],
      "__v": 0,
      "friendCount": 0
    }
    ```

- **Get all users**
  - **Request:**
    ```
    GET /api/users
    ```
  - **Response:**
    ```json
    [
      {
        "_id": "60d0fe4f5311236168a109ca",
        "username": "user1",
        "email": "user1@example.com",
        "thoughts": [],
        "friends": [],
        "__v": 0,
        "friendCount": 0
      }
    ]
    ```

- **Get a single user by ID**
  - **Request:**
    ```
    GET /api/users/:userId
    ```
  - **Example:**
    ```
    GET /api/users/60d0fe4f5311236168a109ca
    ```
  - **Response:**
    ```json
    {
      "_id": "60d0fe4f5311236168a109ca",
      "username": "user1",
      "email": "user1@example.com",
      "thoughts": [],
      "friends": [],
      "__v": 0,
      "friendCount": 0
    }
    ```

- **Update a user by ID**
  - **Request:**
    ```
    PUT /api/users/:userId
    ```
  - **Example:**
    ```
    PUT /api/users/60d0fe4f5311236168a109ca
    ```
  - **Request Body:**
    ```json
    {
      "username": "updatedUser",
      "email": "updatedUser@example.com"
    }
    ```
  - **Response:**
    ```json
    {
      "_id": "60d0fe4f5311236168a109ca",
      "username": "updatedUser",
      "email": "updatedUser@example.com",
      "thoughts": [],
      "friends": [],
      "__v": 0,
      "friendCount": 0
    }
    ```

- **Delete a user by ID**
  - **Request:**
    ```
    DELETE /api/users/:userId
    ```
  - **Example:**
    ```
    DELETE /api/users/60d0fe4f5311236168a109ca
    ```
  - **Response:**
    ```json
    {
      "message": "User deleted successfully!"
    }
    ```

[Back to Table of Contents](#table-of-contents)

### Thoughts

- **Create a new thought**
  - **Request:**
    ```
    POST /api/thoughts
    ```
  - **Request Body:**
    ```json
    {
      "thoughtText": "This is a thought",
      "username": "user1",
      "userId": "60d0fe4f5311236168a109ca"
    }
    ```
  - **Response:**
    ```json
    {
      "_id": "60d0fe4f5311236168a109cc",
      "thoughtText": "This is a thought",
      "createdAt": "2024-08-01T12:34:56.789Z",
      "username": "user1",
      "reactions": [],
      "__v": 0,
      "reactionCount": 0
    }
    ```

- **Get all thoughts**
  - **Request:**
    ```
    GET /api/thoughts
    ```
  - **Response:**
    ```json
    [
      {
        "_id": "60d0fe4f5311236168a109cc",
        "thoughtText": "This is a thought",
        "createdAt": "2024-08-01T12:34:56.789Z",
        "username": "user1",
        "reactions": [],
        "__v": 0,
        "reactionCount": 0
      }
    ]
    ```

- **Get a single thought by ID**
  - **Request:**
    ```
    GET /api/thoughts/:thoughtId
    ```
  - **Example:**
    ```
    GET /api/thoughts/60d0fe4f5311236168a109cc
    ```
  - **Response:**
    ```json
    {
      "_id": "60d0fe4f5311236168a109cc",
      "thoughtText": "This is a thought",
      "createdAt": "2024-08-01T12:34:56.789Z",
      "username": "user1",
      "reactions": [],
      "__v": 0,
      "reactionCount": 0
    }
    ```

- **Update a thought by ID**
  - **Request:**
    ```
    PUT /api/thoughts/:thoughtId
    ```
  - **Example:**
    ```
    PUT /api/thoughts/60d0fe4f5311236168a109cc
    ```
  - **Request Body:**
    ```json
    {
      "thoughtText": "Here's an updated thought..."
    }
    ```
  - **Response:**
    ```json
    {
      "_id": "60d0fe4f5311236168a109cc",
      "thoughtText": "Here's an updated thought...",
      "createdAt": "2024-08-01T12:34:56.789Z",
      "username": "user1",
      "reactions": [],
      "__v": 0,
      "reactionCount": 0
    }
    ```

- **Delete a thought by ID**
  - **Request:**
    ```
    DELETE /api/thoughts/:thoughtId
    ```
  - **Example:**
    ```
    DELETE /api/thoughts/60d0fe4f5311236168a109cc
    ```
  - **Response:**
    ```json
    {
      "message": "Thought deleted successfully!"
    }
    ```

[Back to Table of Contents](#table-of-contents)

### Friends

- **Add a friend to a user's friend list**
  - **Request:**
    ```
    POST /api/users/:userId/friends/:friendId
    ```
  - **Example:**
    ```
    POST /api/users/60d0fe4f5311236168a109ca/friends/60d0fe4f5311236168a109cb
    ```
  - **Response:**
    ```json
    {
      "message": "Friend added successfully!"
    }
    ```

- **Remove a friend from a user's friend list**
  - **Request:**
    ```
    DELETE /api/users/:userId/friends/:friendId
    ```
  - **Example:**
    ```
    DELETE /api/users/60d0fe4f5311236168a109ca/friends/60d0fe4f5311236168a109cb
    ```
  - **Response:**
    ```json
    {
      "message": "Friend removed successfully!"
    }
    ```

[Back to Table of Contents](#table-of-contents)

### Reactions

- **Add a reaction to a thought**
  - **Request:**
    ```
    POST /api/thoughts/:thoughtId/reactions
    ```
  - **Example:**
    ```
    POST /api/thoughts/60d0fe4f5311236168a109cc/reactions
    ```
  - **Request Body:**
    ```json
    {
      "reactionBody": "Great thought!",
      "username": "user2"
    }
    ```
  - **Response:**
    ```json
    {
      "_id": "60d0fe4f5311236168a109cc",
      "thoughtText": "This is a thought",
      "createdAt": "2024-08-01T12:34:56.789Z",
      "username": "user1",
      "reactions": [
        {
          "reactionId": "60d0fe4f5311236168a109cd",
          "reactionBody": "Great thought!",
          "username": "user2",
          "createdAt": "2024-08-01T12:34:56.789Z"
        }
      ],
      "__v": 0,
      "reactionCount": 1
    }
    ```

- **Remove a reaction from a thought**
  - **Request:**
    ```
    DELETE /api/thoughts/:thoughtId/reactions/:reactionId
    ```
  - **Example:**
    ```
    DELETE /api/thoughts/60d0fe4f5311236168a109cc/reactions/60d0fe4f5311236168a109cd
    ```
  - **Response:**
    ```json
    {
      "message": "Reaction deleted successfully!"
    }
    ```

[Back to Table of Contents](#table-of-contents)

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

[Back to Table of Contents](#table-of-contents)

## Walkthrough Video

[Link to walkthrough video demonstrating the functionality of the application](#)

[Back to Table of Contents](#table-of-contents)

## Contributing

If you would like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

1. **Fork the repository**

2. **Create your feature branch:**

   ```sh
   git checkout -b feature/YourFeatureName
   ```

3. **Commit your changes:**

   ```sh
   git commit -m 'Add some feature'
   ```

4. **Push to the branch:**

   ```sh
   git push origin feature/YourFeatureName
   ```

5. **Create a new Pull Request**

[Back to Table of Contents](#table-of-contents)

## Credits

This project was made possible with the help of [ChatGPT](https://chatgpt.com/).

[Back to Table of Contents](#table-of-contents)

## License

This project is licensed under the [MIT License](LICENSE).

[Back to Table of Contents](#table-of-contents)

---

© 2024 Truong Ngo. All rights reserved.

(18 NoSQL: Social Network API)
