// src/components/buttons/EditButton.js
import React from 'react';
import { FaEdit } from 'react-icons/fa';
import './AddButton.css'; // Using the same CSS

const EditButton = ({ onClick, label = "Edit Record", type = "default" }) => {
  return (
    <button className={`add-record-btn add-record-${type.toLowerCase()}`} onClick={onClick}>
      <FaEdit className="add-record-icon" />
      {label}
    </button>
  );
};

export default EditButton;