// src/components/Sidebar.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="h-full bg-gray-900 flex flex-col p-4">
      <button className="bg-blue-500 text-white px-3 py-2 rounded mb-2 hover:bg-blue-700">Change Model</button>
      <Link to="/chats" className="text-white px-3 py-2 rounded mb-2 hover:bg-gray-800">Chats</Link>
      <Link to="/model-list" className="text-white px-3 py-2 rounded mb-2 hover:bg-gray-800">Model List</Link>
    </div>
  );
};

export default Sidebar;
