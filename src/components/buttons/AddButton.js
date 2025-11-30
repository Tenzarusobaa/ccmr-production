// src/components/buttons/AddButton.js
import React from 'react';
import { FaPen } from 'react-icons/fa';
import './AddButton.css';

const AddButton = ({ onClick, label = "Add Record", type = "default" }) => {
  return (
    <button className={`add-record-btn add-record-${type.toLowerCase()}`} onClick={onClick}>
      <FaPen className="add-record-icon" />
      {label}
    </button>
  );
};

export default AddButton;