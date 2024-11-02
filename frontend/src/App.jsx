import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import MainArea from './components/MainArea';

const ChatUI = () => {
  const [activeTab, setActiveTab] = useState('Chat 1');
  const [inputValue, setInputValue] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') {
      alert('Please enter a message before submitting.');
      return;
    }
    // Add the new message to the list
    setMessages([...messages, inputValue]);
    setInputValue(''); // Clear the input after submitting
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="flex h-screen relative">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showPopup={showPopup}
        togglePopup={togglePopup}
      />
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
