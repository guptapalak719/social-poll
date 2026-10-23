# Social Poll - Community Polling Web Application

## Project Overview

Social Poll is a web application prototype where users can create polls, vote on available options, view voting results, discuss poll topics through comments, and register or log in using an email and password.

This project was developed as part of internship assessment using Node.js and Express.js, with a lightweight browser-based interface.

## Features Implemented

- **Poll Creation:** Create a poll with a question and 2–6 options.
- **Voting System:** Vote on poll options and change an existing vote.
- **Live Results Display:** View vote counts and percentage bars.
- **Comments:** Post and view comments under individual polls.
- **User Registration:** Register with a name, email, and password.
- **User Login:** Authenticate registered users using email and password.
- **Password Hashing:** Uses `bcryptjs` to hash passwords.
- **JWT Generation:** Generates JSON Web Tokens during registration and login.
- **REST API:** Provides endpoints for polls, voting, comments, registration, and login.
- **Responsive Layout:** Includes a browser-based interface designed to adapt to different screen sizes.

## Technology Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Authentication Libraries:** bcryptjs, jsonwebtoken
- **Data Storage:** Temporary in-memory JavaScript arrays and objects
- **Database:** MongoDB Atlas connection is planned but is not currently integrated into the demo server.

## Prerequisites

- Node.js and npm installed
- Visual Studio Code or another code editor

## How to Run

1. Open the project folder in VS Code.
2. Open the integrated terminal.
3. Install the required packages if they are not already installed:

   `npm.cmd install express bcryptjs jsonwebtoken`

4. Start the demo server:

   `node demo-server.js`

5. Open the following address in your browser:

   `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/polls` | Retrieve polls and results |
| POST | `/api/polls` | Create a poll |
| POST | `/api/polls/:id/vote` | Submit or change a vote |
| GET | `/api/polls/:id/comments` | Retrieve poll comments |
| POST | `/api/polls/:id/comments` | Add a comment |
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in a user |

## Current Limitations

- Polls, votes, comments, and registered users are stored in memory and reset when the server restarts.
- MongoDB persistence has not yet been connected to `demo-server.js`.
- JWTs are generated, but protected-route verification has not been implemented.
- The current browser-based login state is a demo convenience, not a secure authenticated session.
- Voting identity is based on a browser-generated identifier rather than a verified account.
- Production deployment would require additional security controls, persistent storage, validation, and testing.

## Future Improvements

- Integrate MongoDB Atlas for persistent data storage.
- Protect private endpoints using JWT verification middleware.
- Associate votes and comments with authenticated user accounts.
- Add poll expiry, profiles, and improved discussion features.
- Add automated tests and production deployment.

## Project Status

**Working prototype:** Core poll creation, voting, results, comments, registration, and login flows are implemented in the demo server.

The project is a prototype and requires persistent storage and additional security work before production use.
