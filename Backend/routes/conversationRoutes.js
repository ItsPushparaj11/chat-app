import express from "express";
import { getConversations, createConversation, deleteConversation } from "../controlllers/conversationController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/").get(isAuthenticated, getConversations).post(isAuthenticated, createConversation);
router.route("/:conversationId").delete(isAuthenticated, deleteConversation);

export default router;