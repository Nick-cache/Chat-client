import React, { useState } from 'react';
import './App.css';
import MainArea from './components/MainArea';

const ChatUI = () => {
  const [activeTab, setActiveTab] = useState('Chat 1');
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessages([...messages, inputValue]);
    setInputValue('');
  };



  return (
    <div className="h-screen bg-gradient-to-b from-teal-900 to-black">
      <MainArea
        activeTab={activeTab}
        inputValue={inputValue}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        messages={messages}
      />
    </div>
  );
};
export default ChatUI;
