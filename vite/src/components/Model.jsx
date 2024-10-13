// src/components/Model.jsx

import React, { useState } from 'react';

const Model = ({ models, selectedModel, onChange }) => {
  return (
    <select
      value={selectedModel}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-700 text-white px-3 py-2 rounded border-none focus:outline-none"
    >
      {models.map((model, index) => (
        <option key={index} value={model}>
          {model}
        </option>
      ))}
    </select>
  );
};

export default Model;
