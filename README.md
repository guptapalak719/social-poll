# POLL SOCIAL — Full Stack Developer Assessment

## Project Overview

POLL SOCIAL is a mini social polling platform prototype developed as part of the Full Stack Developer technical assessment.

The prototype demonstrates the core flow of a polling application:
- User registration and login
- Poll creation
- Voting with one choice per voter and vote changes
- Poll result display
- Comments on polls
- Basic input validation
- Password hashing with bcryptjs
- JWT-based authentication in the demo application

## Technology Stack

- Backend: Node.js + Express.js
- Database: MongoDB
- Authentication: JWT + bcryptjs
- Frontend: HTML, CSS and JavaScript prototype UI
- Environment configuration: dotenv
- Version control: Git + GitHub

## Current Implementation

The project contains two stages of implementation:

### 1. Working Demo Prototype

`demo-server.js` contains the functional polling prototype with:
- Registration and login
- JWT generation
- Password hashing
- Poll creation
- Voting
- Vote changes
- Poll results
- Add/view comments
- Basic validation and output escaping

The demo currently stores its runtime data in memory.

### 2. MongoDB Backend Setup

`server.js` and `config/db.js` establish the MongoDB-backed Express application.

MongoDB connectivity was tested successfully against the `internshipDB` database. The current MongoDB-backed API includes basic user retrieval and user creation through `/api/users`.

The complete migration of every demo feature from in-memory storage to MongoDB was not completed within the assessment work period.

## API / Feature Status

### Implemented in the prototype
- User registration
- User login
- JWT token generation
- Password hashing
- Create poll
- View polls
- Vote on a poll
- Change vote
- View vote results
- Add comments
- View comments
- Basic validation

### Not completed
- Full MongoDB persistence for polls, votes and comments
- Edit own poll
- Delete own poll
- Poll expiry enforcement
- Pagination
- Keyword search
- Sorting by Latest / Most Voted
- Delete own comments
- User profile statistics
- Full production-grade authentication/authorization middleware across every protected route
- Deployment / live demo

## Database Design

A proposed relational-style logical schema is provided in `poll-social-er-diagram.png` for the assessment submission.

Main entities:
- Users
- Polls
- Votes
- Comments

Key relationships:
- One user can create many polls.
- One user can cast many votes.
- One poll can receive many votes.
- One user can write many comments.
- One poll can contain many comments.
- A vote is logically unique for each user-poll combination.

## Environment Variables

Create a `.env` file locally:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Do not commit `.env` or credentials to GitHub.

## Run the Project

Install dependencies:

```powershell
npm.cmd install
```

Start the MongoDB-backed Express server:

```powershell
npm.cmd start
```

The server runs on:

```text
http://localhost:3000
```

For the original functional demo prototype:

```powershell
node demo-server.js
```

Note: both applications use port 3000 by default, so they should not be started simultaneously unless one is configured to use another port.

## Database Connection Test

The MongoDB connection can be verified with:

```powershell
node test-db.js
```

Successful verification prints:

```text
MongoDB connected successfully!
Database name: internshipDB
Database connection test passed!
```

## Assessment Submission

GitHub Repository:

https://github.com/guptapalak719/social-poll

Live Demo:

Not deployed. The assessment instructions mark deployment as optional/preferred.

## Assessment Scope

The project was developed with a focus on building a functional prototype within the assessment time limit and prioritizing the core polling flow over additional polish and incomplete features.
