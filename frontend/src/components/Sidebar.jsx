import React from 'react';
import ModelPopup from './ModelPopup';

const Sidebar = ({ activeTab, setActiveTab, showPopup, togglePopup }) => {
  return (
    <div className="bg-gray-100 w-64 flex flex-col p-4">
      <header className="mb-4">
        <button
          onClick={togglePopup}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Load Model
        </button>
        {showPopup && (
          <ModelPopup togglePopup={togglePopup} />
        )}
      </header>
      <ul className="space-y-2">
        {['Chat 1', 'Chat 2', 'Chat 3'].map((chat, index) => (
          <li
            key={index}
            onClick={() => setActiveTab(chat)}
            className={`px-4 py-2 text-left ${
              activeTab === chat ? 'bg-gray-300' : ''
            }`}
          >
            {chat}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
