import { Message } from "../models/messageModel.js";
import { Conversation } from "../models/conversationModels.js";

export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        if (!conversation.Participants.includes(req.user._id)) {
            return res.status(403).json({ message: "Not authorized" });
        }
        const messages = await Message.find({ _id: { $in: conversation.Messages } }).populate("senderId", "fullname username profilephoto");
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { conversationId, message } = req.body;
        const senderId = req.user._id;
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        if (!conversation.Participants.includes(senderId)) {
            return res.status(403).json({ message: "Not authorized" });
        }
        const receiverId = conversation.Participants.find(id => id.toString() !== senderId.toString());
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        conversation.Messages.push(newMessage._id);
        await conversation.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        if (message.senderId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }
        await Message.findByIdAndDelete(messageId);
        await Conversation.updateMany(
            { Messages: messageId },
            { $pull: { Messages: messageId } }
        );
        res.status(200).json({ message: "Message deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};