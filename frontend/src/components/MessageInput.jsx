import React from 'react';

const MessageInput = ({ inputValue, handleInputChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center relative">
      <textarea
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Type a message..."
        className="flex-1 border rounded-l p-2 mr-2 min-h-[5rem] h-[5rem]" // Fixed height here
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r">Send</button>
    </form>
  );
};

export default MessageInput;
