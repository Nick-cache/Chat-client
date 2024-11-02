import React from 'react';
import ChatContent from './ChatContent';
import MessageInput from './MessageInput';

const MainArea = ({ activeTab, inputValue, handleInputChange, handleSubmit, messages }) => {
  return (
    <div className="flex-1 p-4 relative flex flex-col">
      {activeTab.startsWith('Chat') && (
        <>
          <h1>{activeTab}</h1>
          <ChatContent messages={messages} />
          <MessageInput
            inputValue={inputValue}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </>
      )}
    </div>
  );
};

export default MainArea;
