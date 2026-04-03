import { Conversation } from "../models/conversationModels.js";
import { Message } from "../models/messageModel.js";

export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        const conversations = await Conversation.find({
            Participants: userId
        }).populate("Participants", "fullname username profilephoto").populate("Messages");
        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const createConversation = async (req, res) => {
    try {
        const { receiverId } = req.body;
        const senderId = req.user._id;
        const existingConversation = await Conversation.findOne({
            Participants: { $all: [senderId, receiverId] }
        });
        if (existingConversation) {
            return res.status(200).json(existingConversation);
        }
        const newConversation = await Conversation.create({
            Participants: [senderId, receiverId]
        });
        res.status(201).json(newConversation);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        if (!conversation.Participants.includes(req.user._id)) {
            return res.status(403).json({ message: "Not authorized" });
        }
        await Message.deleteMany({ _id: { $in: conversation.Messages } });
        await Conversation.findByIdAndDelete(conversationId);
        res.status(200).json({ message: "Conversation deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};