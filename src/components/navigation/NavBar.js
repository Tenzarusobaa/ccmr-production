// src/components/navigation/NavBar.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import NotificationsModal from "../modals/NotificationModal";
import "./NavBar.css";

const NavBar = ({ userDepartment, userType, userName, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    
    const department = userDepartment || localStorage.getItem('userDepartment') || 'Unknown Department';
    const type = userType || localStorage.getItem('userType') || 'Unknown Type';
    const name = userName || localStorage.getItem("userName") || "User";

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
            <header className={`navbar-container department-${type.toLowerCase()}`}>
                <div className="navbar-top">
                    {/* Logo */}
                    <div className="navbar-logo">
                        <img
                            src={require("../../assets/school-seal.png")}
                            alt="Logo"
                            className="navbar-logo-image"
                        />
                        <div className="navbar-logo-text-container">
                            <div className="navbar-logo-main-text">CCMR</div>
                            <div className="navbar-logo-department-text">{department} ({type})</div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <nav className="navbar-center">
                        {navItems.map((item, index) => (
                            <div
                                key={index}
                                className={`navbar-item ${isActive(item) ? 'active' : ''}`}
                                onClick={() => handleNavClick(item)}
                                style={{ cursor: 'pointer' }}
                            >
                                {item}
                            </div>
                        ))}
                    </nav>

                    {/* Right Section */}
                    <div className="navbar-right">
                        <FontAwesomeIcon 
                            icon={faBell} 
                            className="navbar-notification-icon" 
                            u
                            style={{ cursor: 'pointer' }}
                            title="View notifications"
                        />
                        <div className="navbar-profile-circle">{name[0]}</div>
                        <button onClick={onLogout} className="navbar-logout-btn">
                            Logout
                        </button>
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

export default NavBar;