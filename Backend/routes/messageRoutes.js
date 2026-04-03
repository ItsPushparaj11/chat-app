import express from "express";
import { getMessages, sendMessage, deleteMessage } from "../controlllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/:conversationId").get(isAuthenticated, getMessages);
router.route("/").post(isAuthenticated, sendMessage);
router.route("/:messageId").delete(isAuthenticated, deleteMessage);

export default router;