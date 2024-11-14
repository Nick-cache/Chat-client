import { useSelector } from 'react-redux';
import React from 'react';
import ChatContent from './ChatContent';
import MessageInput from './MessageInput';
import ModelsSelector from './ModelsSelector';

const MainArea = ({ activeTab, inputValue, handleInputChange, handleSubmit, messages}) => {

  return (
    <div className="w-[100%] h-[85%] items-baseline ">
      <ChatContent messages={messages} />
      <div className='flex mb-20 justify-beetwen'>
        <ModelsSelector />
        <MessageInput
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default MainArea;
