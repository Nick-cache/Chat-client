// src/pages/ModelsPage.jsx

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Model from '../components/Model';

const ModelsPage = () => {
  const [selectedModel, setSelectedModel] = useState('OpenAI GPT-3');
  const models = ['OpenAI GPT-3', 'Google BERT', 'Microsoft Azure'];

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 w-full bg-gray-800 flex flex-col space-y-4">
        <h2 className="text-white">Select Model</h2>
        <Model models={models} selectedModel={selectedModel} onChange={setSelectedModel} />
      </div>
    </div>
  );
};

export default ModelsPage;
