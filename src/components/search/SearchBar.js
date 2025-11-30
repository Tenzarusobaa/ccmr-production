// src/components/globals/SearchBar.js
import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({ placeholder = "Search ID Number...", onSearch, disabled = false }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onSearch) {
        onSearch(searchQuery);
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch(''); // This will trigger a search with empty query to show all records
    }
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <FaSearch 
          className="search-icon" 
          onClick={handleSearchClick}
          style={{ cursor: 'pointer' }}
        />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={disabled}
        />
        {searchQuery && (
          <FaTimes 
            className="clear-icon" 
            onClick={handleClearSearch}
            style={{ cursor: 'pointer' }}
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;