// src/components/common/StudentAutocomplete.js
import React from 'react';
import './StudentAutocomplete.css';

const StudentAutocomplete = ({
  value,
  onChange,
  onStudentSelect,
  studentSuggestions,
  showSuggestions,
  isLoading,
  placeholder = "Enter ID Number",
  required = false,
  disabled = false
}) => {
  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  const handleSuggestionClick = (student) => {
    onStudentSelect(student);
  };

  return (
    <div className="student-autocomplete-container">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete="off"
        className="autocomplete-input"
      />
      
      {isLoading && (
        <div className="suggestions-dropdown">
          <div className="suggestion-item loading">Loading...</div>
        </div>
      )}
      
      {showSuggestions && !isLoading && (
        <div className="suggestions-dropdown">
          {studentSuggestions.map((student, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(student)}
            >
              <div className="student-id">{student.sd_id_number}</div>
              <div className="student-name">{student.sd_student_name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAutocomplete;