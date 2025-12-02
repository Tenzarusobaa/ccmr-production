import React from 'react';
import './FilterButton.css';

const FilterButton = ({ type = 'default', onClick, currentFilter }) => {
  const getButtonClass = () => {
    switch (type) {
      case "OPD": return "filter-btn filter-btn-opd";
      case "GCO": return "filter-btn filter-btn-gco";
      case "INF": return "filter-btn filter-btn-inf";
      default: return "filter-btn filter-btn-default";
    }
  };

  const getFilterLabel = () => {
    switch (currentFilter) {
      case 'ALL': return 'All Records';
      case 'MEDICALPSYCHOLOGICAL': return 'Medical & Psychological Records';
      case 'MEDICAL': return 'Medical Only';
      case 'PSYCHOLOGICAL': return 'Psychological Only';
      default: return 'All Records';
    }
  };

  return (
    <button 
      className={getButtonClass()}
      onClick={onClick}
      title="Click to cycle through filter states"
    >
      {getFilterLabel()}
    </button>
  );
};

export default FilterButton;