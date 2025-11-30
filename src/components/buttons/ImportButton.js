// src/components/buttons/ImportButton.js
import React from 'react';
import { FaFileImport } from 'react-icons/fa';
import './ImportButton.css';

const ImportButton = ({ onClick, label = "Import", type = "default" }) => {
  return (
    <button className={`import-btn import-${type.toLowerCase()}`} onClick={onClick}>
      <FaFileImport className="import-icon" />
      {label}
    </button>
  );
};

export default ImportButton;