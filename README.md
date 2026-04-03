# Chat Application

A full-stack MERN chat application with real-time messaging.

## Features

- User registration and login
- Real-time chat with Socket.io
- CRUD operations for users, conversations, and messages
- JWT authentication

## Tech Stack

- **Frontend:** React, Axios, Socket.io-client, React Router
- **Backend:** Node.js, Express, MongoDB, Mongoose, Socket.io
- **Authentication:** JWT

## Installation

### Backend

1. cd Backend
2. npm install
3. Create .env file with:
   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   PORT=5001
   ```
4. npm run dev

### Frontend

1. cd frontend
2. npm install
3. npm start

## Project Structure

```
Chat app/
├── Backend/
│   ├── config/
│   │   └── database.js           # MongoDB connection
│   ├── controlllers/            # Business logic for API operations
│   │   ├── userController.js
│   │   ├── conversationController.js
│   │   └── messageController.js
│   ├── middleware/
│   │   └── isAuthenticated.js    # JWT auth middleware
│   ├── models/                  # Mongoose schemas
│   │   ├── userModel.js
│   │   ├── conversationModels.js
│   │   └── messageModel.js
│   ├── routes/                  # Express routes
│   │   ├── userRoutes.js
│   │   ├── conversationRoutes.js
│   │   └── messageRoutes.js
│   ├── .env                     # Environment variables (ignored in git)
│   ├── index.js                 # Express + socket.io server
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── Chat.js
│   │   │   └── Chat.css
│   │   ├── AuthContext.js       # Auth state + API helper
   │   │   └── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
└── README.md
```

## API Endpoints

- POST /api/users/register - Register user
- POST /api/users/login - Login user
- GET /api/conversations - Get user conversations
- POST /api/conversations - Create conversation
- DELETE /api/conversations/:id - Delete conversation
- GET /api/messages/:conversationId - Get messages
- POST /api/messages - Send message
- DELETE /api/messages/:id - Delete message

## Usage

1. Register a new account or login
2. Start chatting in real-time

## Author
Pushpa Raj Dhamala and Harsh Chavan
