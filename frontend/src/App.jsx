import { useState } from 'react';
import './App.css';

const ChatUI = () => {
  const [activeTab, setActiveTab] = useState('Chat 1');
  const [inputValue, setInputValue] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') {
      alert('Please enter a message before submitting.');
      return;
    }
    setInputValue('');
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="flex h-screen relative">
      {/* Sidebar */}
      <div className="bg-gray-100 w-64 flex flex-col p-4">
        <header className="mb-4">
          <button
            onClick={togglePopup}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Load Model
          </button>
          {showPopup && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
              onClick={togglePopup}
            >
              <div
                className="bg-white p-8 rounded shadow-lg w-[90%] h-[90%] max-w-full max-h-full mx-auto cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-lg font-bold mb-4">Load Model</h2>
                {/* Add model list here */}
                <ul className="space-y-2">
                  {['Model 1', 'Model 2', 'Model 3'].map((model, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        console.log(`Loading ${model}`);
                        togglePopup();
                      }}
                      className="px-4 py-2 rounded hover:bg-gray-200 cursor-pointer"
                    >
                      {model}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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

      {/* Main Area */}
      <div className="flex-1 p-4 relative flex flex-col">
        {activeTab.startsWith('Chat') && (
          <>
            <h1>{activeTab}</h1>
            <div className="w-full max-w-[80%] bg-white rounded-b border-t px-4 mx-auto py-2 text-gray-600 overflow-y-auto h-[90%] flex items-center flex-col chat-content">
              {/* Add chat list and chat content here */}
              {/* Example chat content */}
              <p>More chat content...</p>
              <p>More chat content...</p>
            </div>

            {/* Input form at the bottom center */}
            <form onSubmit={handleSubmit} className="flex items-center justify-center relative">
              <textarea
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type a message..."
                className="flex-1 border rounded-l p-2 mr-2 min-h-[5rem] scrollbar-thin" // Increased height here and added custom scrollbar class
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r">Send</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatUI;
