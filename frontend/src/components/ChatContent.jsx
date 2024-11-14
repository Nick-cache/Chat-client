import React from 'react';
import Message from './Message';

const ChatContent = ({ messages }) => {
  return (
    <div className="w-[100%] px-4 mx-auto py-2 text-gray-600 overflow-y-auto h-[100%] flex items-center flex-col bg-transparent">
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}
    </div>
  );
};

export default ChatContent;
