// src/components/metrics/Metrics.js
import React from 'react';
import './Metrics.css';

const Metrics = ({ metrics = {} }) => {
  const defaultMetrics = {
    total: 0,
    minor: 0,
    major: 0,
    serious: 0,
    ongoing: 0,
    resolved: 0
  };

  const metricData = { ...defaultMetrics, ...metrics };

  const metricConfig = [
    { key: 'total', icon: 'fas fa-list', label: 'Total' },
    { key: 'minor', icon: 'fas fa-exclamation', label: 'Minor' },
    { key: 'major', icon: 'fas fa-exclamation-circle', label: 'Major' },
    { key: 'serious', icon: 'fas fa-exclamation-triangle', label: 'Serious' },
    { key: 'ongoing', icon: 'fas fa-spinner', label: 'Ongoing' },
    { key: 'resolved', icon: 'fas fa-check-circle', label: 'Resolved' }
  ];

  return (
    <div className="metrics">
      {metricConfig.map((metric) => (
        <div key={metric.key} className="metric">
          <span>
            <i className={metric.icon}></i> {metricData[metric.key]}
          </span>
          <small>{metric.label}</small>
        </div>
      ))}
    </div>
  );
};

export default Metrics;