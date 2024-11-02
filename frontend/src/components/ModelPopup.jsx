import React from 'react';

const ModelPopup = ({ togglePopup }) => {
  return (
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
  );
};

export default ModelPopup;
