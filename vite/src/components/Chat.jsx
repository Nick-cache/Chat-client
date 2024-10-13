// src/components/Chat.jsx

import React, { useState } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 p-4 space-y-4">
      <div className="flex-grow overflow-auto max-h-[calc(100vh - 12rem)]">
        {messages.map((message, index) => (
          <li key={index} className={`text-white ${message.sender === 'user' ? 'self-end' : ''}`}>
            {message.text}
          </li>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow bg-gray-800 text-white px-3 py-2 rounded border-none focus:outline-none mr-2"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
