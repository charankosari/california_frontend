import React from 'react';
import { MessageOutlined } from '@ant-design/icons'; // Import Message icon from Ant Design Icons
import './AIChatButton.css'; // Import CSS for styling

const AIChatButton = ({ onClick }) => {
  return (
    <button className="ai-chat-button" onClick={onClick}>
      <MessageOutlined className="ai-icon" />
    </button>
  );
};

export default AIChatButton;
