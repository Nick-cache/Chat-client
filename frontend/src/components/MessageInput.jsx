import React from 'react';

const MessageInput = ({ inputValue, handleInputChange, handleSubmit }) => {
  return (
      <>
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter promt here..."
          className="border-teal-600 border-x-2 rounded bg-transparent h-[45px] w-[50%] text-center text-emerald-100 caret-pink-500 outline-none font-bold text-sm scrollbar-invise m-0 p-0"
        />
        <button type="button" className="ml-8 mb-20 font-bold text-5xl cursor-pointer hover:text-amber-300 border-teal-600/90 text-emerald-300/80">{">"}</button>
      </>
  );
};

export default MessageInput;
