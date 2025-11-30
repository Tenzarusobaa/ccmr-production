// src/components/navigation/DashboardNavigation.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCalendar } from "@fortawesome/free-solid-svg-icons";
import NotificationsModal from "../modals/NotificationModal";
import "./DashboardNavigation.css";

const DashboardNavigation = ({ userDepartment, userType, userName, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    
    const department = userDepartment || localStorage.getItem('userDepartment') || 'Unknown Department';
    const type = userType || localStorage.getItem('userType') || 'Unknown Type';
    const name = userName || localStorage.getItem("userName") || "User";
    const currentDate = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    // Define navigation items and their routes based on user type
    const getNavRoutes = () => {
        switch (type) {
            case "OPD":
                return {
                    "Dashboard": "/dashboard",
                    "OPD Records": "/opd-records",
                    "GCO Records": "/gco-records", 
                    "INF Records": "/inf-records",
                    "Student Data": "/student-data"
                };
            case "GCO":
                return {
                    "Dashboard": "/dashboard",
                    "GCO Records": "/gco-records",
                    "OPD Records": "/opd-records",
                    "INF Records": "/inf-records",
                    "Student Data": "/student-data"
                };
            case "INF":
                return {
                    "Dashboard": "/dashboard",
                    "INF Records": "/inf-records",
                    "GCO Records": "/gco-records",
                    "Student Data": "/student-data"
                };
            default:
                return {
                    "Dashboard": "/dashboard",
                    "Flights": "/flights",
                    "Stays": "/stays",
                    "Rides": "/rides",
                    "Packages": "/packages"
                };
        }
    };

    const navRoutes = getNavRoutes();
    const navItems = Object.keys(navRoutes);

    const handleNavClick = (item) => {
        if (navRoutes[item]) {
            navigate(navRoutes[item]);
        }
    };

    const handleNotificationsClick = () => {
        setIsNotificationsOpen(true);
    };

    // Check if current route matches nav item
    const isActive = (item) => {
        return location.pathname === navRoutes[item];
    };

    return (
        <>
            <header className={`dashboard-header department-${type.toLowerCase()}`}>
                {/* === Top Row === */}
                <div className="header-top">
                    {/* Logo */}
                    <div className="nav-logo">
                        <img
                            src={require("../../assets/school-seal.png")}
                            alt="Logo"
                            className="logo-image"
                        />
                        <div className="logo-text-container">
                            <div className="logo-main-text">CCMR</div>
                            <div className="logo-department-text">{department} ({type})</div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <nav className="nav-center">
                        {navItems.map((item, index) => (
                            <div
                                key={index}
                                className={`nav-item ${isActive(item) ? 'active' : ''}`}
                                onClick={() => handleNavClick(item)}
                                style={{ cursor: 'pointer' }}
                            >
                                {item}
                            </div>
                        ))}
                    </nav>

                    {/* Right Section */}
                    <div className="nav-right">
                        <FontAwesomeIcon 
                            icon={faBell} 
                            className="notification-icon" 
                            onClick={handleNotificationsClick}
                            style={{ cursor: 'pointer' }}
                            title="View notifications"
                        />
                        <div className="profile-circle">{name[0]}</div>
                        <button onClick={onLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </div>

                {/* === Bottom Row === */}
                <div className="header-bottom">
                    <span className="greeting">Welcome, {name}!</span>
                    <div className="date-box">
                        <FontAwesomeIcon icon={faCalendar} />
                        <span>{currentDate}</span>
                    </div>
                </div>
            </header>

            {/* Notifications Modal */}
            <NotificationsModal
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                userType={type}
            />
        </>
    );
};

export default DashboardNavigation;