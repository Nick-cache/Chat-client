// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import ModelsPage from './pages/ModelsPage';
import Header from './components/Header';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-900">
        <Header />
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/chats" element={<ChatPage />} />
          <Route path="/models" element={<ModelsPage />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
