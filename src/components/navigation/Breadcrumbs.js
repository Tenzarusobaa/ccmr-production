// src/components/navigation/Breadcrumbs.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Breadcrumbs.css';

const Breadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Define breadcrumb paths and their display names
  const pathMap = {
    'dashboard': 'Dashboard',
    'opd-records': 'Case Records',
    'gco-records': 'Counseling Records', 
    'inf-records': 'Medical Records',
    'student-data': 'Student Data'
  };

  // Get current path and split into segments
  const pathSegments = location.pathname.split('/').filter(segment => segment);
  
  // Generate breadcrumb items
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const isLast = index === pathSegments.length - 1;
    const displayName = pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    return {
      path: isLast ? null : path, // Last item is not clickable
      displayName,
      isLast
    };
  });

  // Add Dashboard as first breadcrumb if not already there
  if (pathSegments.length > 0 && pathSegments[0] !== 'dashboard') {
    breadcrumbItems.unshift({
      path: '/dashboard',
      displayName: 'Dashboard',
      isLast: false
    });
  }

  const handleBreadcrumbClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <nav className="breadcrumbs">
      {breadcrumbItems.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          {item.path ? (
            <button
              className="breadcrumb-link"
              onClick={() => handleBreadcrumbClick(item.path)}
            >
              {item.displayName}
            </button>
          ) : (
            <span className="breadcrumb-current">{item.displayName}</span>
          )}
          {!item.isLast && <span className="breadcrumb-separator"> &gt; </span>}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;