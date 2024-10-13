// src/pages/ChatPage.jsx

import React from 'react';
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';

const ChatPage = () => {
  return (<>
    <Sidebar />
    <div className="container mx-auto">
      <Chat />
    </div></>
  );
};

export default ChatPage;
