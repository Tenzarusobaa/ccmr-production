// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import OPDRecords from './pages/OPDRecords';
import GCORecords from './pages/GCORecords';
import INFRecords from './pages/INFRecords';
import StudentData from './pages/StudentData';
import './App.css';

// Main app content component that uses router
function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      const userType = localStorage.getItem('userType');
      const userEmail = localStorage.getItem('userEmail');
      const userName = localStorage.getItem('userName');
      const userDepartment = localStorage.getItem('userDepartment');

      if (token && userType && userEmail && userName) {
        const userData = {
          token: token,
          type: userType,
          email: userEmail,
          name: userName,
          department: userDepartment
        };
        setUserData(userData);
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleLogin = (userData) => {
    setUserData(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userDepartment');
    
    setUserData(null);
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="App">
      {isLoggedIn ? (
        <Routes>
          <Route path="/dashboard" element={
            <Dashboard 
              userData={userData} 
              onLogout={handleLogout} 
            />
          } />
          <Route path="/opd-records" element={
            <OPDRecords 
              userData={userData} 
              onLogout={handleLogout} 
            />
          } />
          <Route path="/gco-records" element={
            <GCORecords 
              userData={userData} 
              onLogout={handleLogout} 
            />
          } />
          <Route path="/inf-records" element={
            <INFRecords 
              userData={userData} 
              onLogout={handleLogout} 
            />
          } />
          <Route path="/student-data" element={
            <StudentData 
              userData={userData} 
              onLogout={handleLogout} 
            />
          } />
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          {/* Catch all route - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

// Main App component with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;