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