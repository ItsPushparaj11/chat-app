import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ CORS FIX (IMPORTANT)
const allowedOrigins = [
    "http://localhost:3000",
    "https://chat-app-9-zlub.onrender.com" 
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ ROUTES FIX (IMPORTANT)
app.use("/api/user", userRoutes); // FIXED
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

// ✅ ROOT ROUTE
app.get("/", (req, res) => {
    res.send("Chat App Backend is Running 🚀");
});

// ✅ SOCKET.IO FIX (use same origins)
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinConversation", (conversationId) => {
        socket.join(conversationId);
    });

    socket.on("sendMessage", (data) => {
        io.to(data.conversationId).emit("receiveMessage", data.message);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});