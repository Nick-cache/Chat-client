// src/components/Modal.jsx

import React from 'react';
import { Modal as ReactModal } from 'react-modal';

ReactModal.setAppElement('#root');

const Modal = ({ isOpen, onRequestClose, children }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white rounded-lg p-6 shadow-lg"
      overlayClassName="fixed inset-0 bg-gray-800 opacity-50 flex items-center justify-center z-10"
    >
      {children}
    </ReactModal>
  );
};

export default Modal;
