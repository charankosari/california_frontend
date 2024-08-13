import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { VscRobot } from "react-icons/vsc";
import './Chat.css';

const Chat = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [typing, setTyping] = useState(false); // State to manage typing animation

  useEffect(() => {
    const storedMessages = JSON.parse(sessionStorage.getItem('chatMessages')) || [];
    setMessages(storedMessages);
  }, []);

  const sendMessage = async () => {
    const trimmedMessage = inputMessage.trim();
    if (trimmedMessage === '') return;

    const newMessage = {
      sender: 'user',
      text: trimmedMessage,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage('');
    const url='https://oneapp.trivedagroup.com'

    try {
      const apiUrl = messages.length === 0
        ? `${url}/api/c3/user/greetchat`
        : `${url}/api/c3/user/chat`;

      const jwtToken = localStorage.getItem('jwtToken');
      if (!jwtToken) {
        throw new Error('JWT token not found in localStorage');
      }
      setTyping(true);
      const response = await axios.post(apiUrl, {
        question: newMessage.text,
      }, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      setTyping(false);
      const cleanText = (text) => {
        return text.replace(/\*\*.*?\*\*|\n/g, '').trim();
      };
      const botResponse = {
        sender: 'bot',
        text: cleanText(response.data.response),
      };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, botResponse];
        sessionStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    } catch (error) {
      console.error('Error sending/receiving message:', error);
    }
  };
  const handleCloseChat = () => {
    sessionStorage.removeItem('chatMessages');
    if (onClose && typeof onClose === 'function') {
      onClose();
    } else {
      console.error('onClose is not a function or not provided');
    }
  };
  const TypingAnimation = () => {
    return (
      <div className="typing-animation">
        <span className="dot">.</span>
        <span className="dot">.</span>
        <span className="dot">.</span>
      </div>
    );
  };
  return (
    <div className="mobile-chat-container">
      <div className="mobile-chat-border">
        <div className="chat-header">
          <VscRobot className="profile-icon" />

          <h5>Chatbot</h5>
          <button className="close-button" onClick={handleCloseChat}>✖</button>
        </div>
        <div className="chat-messages " style={{width:'80%'}}>
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
          {typing && <TypingAnimation />} 
        </div>
        <div className="chat-input-form">
          <input
            type="text"
            className="chat-input"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && inputMessage.trim() !== '') {
                sendMessage();
              }
            }}
          />
          <button
            className="send-button"
            onClick={sendMessage}
            disabled={inputMessage.trim() === ''}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;