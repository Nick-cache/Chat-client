import React from 'react';
import Message from './Message';

const ChatContent = ({ messages }) => {
  return (
    <div className="w-full max-w-[80%] bg-white rounded-b border-t px-4 mx-auto py-2 text-gray-600 overflow-y-auto h-[90%] flex items-center flex-col chat-content">
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}
    </div>
  );
};

export default ChatContent;
