import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import './Chat.css';

const socket = io('https://chat-app-7-nzuw.onrender.com');

const Chat = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchConversations();
        }
    }, [user, navigate]);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation._id);
            socket.emit('joinConversation', selectedConversation._id);
        }
    }, [selectedConversation]);

    useEffect(() => {
        socket.on('receiveMessage', (message) => {
            setMessages((prev) => [...prev, message]);
        });
        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    const fetchConversations = async () => {
        try {
            const res = await axios.get('https://chat-app-7-nzuw.onrender.com/api/conversations');
            setConversations(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const res = await axios.get(`https://chat-app-7-nzuw.onrender.com/api/messages/${conversationId}`);
            setMessages(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            const res = await axios.post('https://chat-app-7-nzuw.onrender.com/api/messages', {
                conversationId: selectedConversation._id,
                message: newMessage
            });
            socket.emit('sendMessage', {
                conversationId: selectedConversation._id,
                message: res.data
            });
            setNewMessage('');
        } catch (error) {
            console.error(error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="chat-container">
            <div className="sidebar">
                <div className="user-info">
                    <img src={user.profilephoto} alt="Profile" />
                    <span>{user.fullname}</span>
                    <button onClick={logout}>Logout</button>
                </div>
                <div className="conversations">
                    {conversations.map((conv) => (
                        <div
                            key={conv._id}
                            className={`conversation ${selectedConversation?._id === conv._id ? 'active' : ''}`}
                            onClick={() => setSelectedConversation(conv)}
                        >
                            {conv.Participants.filter(p => p._id !== user._id).map(p => (
                                <div key={p._id}>
                                    <img src={p.profilephoto} alt="Profile" />
                                    <span>{p.fullname}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className="chat-area">
                {selectedConversation ? (
                    <>
                        <div className="messages">
                            {messages.map((msg) => (
                                <div key={msg._id} className={`message ${msg.senderId._id === user._id ? 'own' : ''}`}>
                                    <img src={msg.senderId.profilephoto} alt="Profile" />
                                    <div>
                                        <span>{msg.senderId.fullname}</span>
                                        <p>{msg.message}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="message-input">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            />
                            <button onClick={sendMessage}>Send</button>
                        </div>
                    </>
                ) : (
                    <div className="no-conversation">Select a conversation to start chatting</div>
                )}
            </div>
        </div>
    );
};

export default Chat;