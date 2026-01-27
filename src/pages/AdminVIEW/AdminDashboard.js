// src/pages/AdminVIEW/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardNavigation from "../../components/navigation/DashboardNavigation";
import "../Dashboard.css";
import ViewRecordComponent from "../../components/modals/ViewRecordComponent";

// Import table components
import OPDPsychologicalRecordsGCO from "../../components/tables/dashboard-tables/OPDPsychologicalRecordsGCO";
import OPDMedicalRecordsINF from "../../components/tables/dashboard-tables/OPDMedicalRecordsINF";
import OPDPsychologicalRecordsINF from "../../components/tables/dashboard-tables/OPDPsychologicalRecordsINF";
import GCOCounselingRecords from "../../components/tables/dashboard-tables/GCOCounselingRecords";
import INFPsychologicalRecordsGCO from "../../components/tables/dashboard-tables/INFPsychologicalRecordsGCO";
import AnalyticsReport from '../../components/analytics/AnalyticsReport';
import TallyAnalytics from '../../components/analytics/TallyAnalytics';
import QuickActions from '../../components/quick-actions/QuickActions';

const AdminDashboard = ({ userData, onLogout, onNavItemClick, onExitViewAs }) => {
  const location = useLocation();
  const department = userData?.department || localStorage.getItem('userDepartment') || 'Administrator';
  const type = userData?.type || localStorage.getItem('type') || 'Administrator';
  
  // Force viewType to be Administrator for admin view pages
  const viewType = "Administrator";

  const name = userData?.name || localStorage.getItem('userName') || 'User';
  const [activeTab, setActiveTab] = useState(0);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Function to get office class - always use default for Admin View
  const getOfficeClass = () => {
    return "office-records-default";
  };

  // Function to handle row click
  const handleRowClick = (record, recordType) => {
    setSelectedRecord({ ...record, recordType });
    setViewModalOpen(true);
  };

  // Function to close view modal
  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedRecord(null);
  };

  // Handle exit view as for Administrator
  const handleExitViewAs = () => {
    if (onExitViewAs) {
      onExitViewAs();
    }
  };

  // Define tabs and components for Admin View
  const getTabsConfig = () => {
    // Admin View - Show all office data in separate tabs
    return {
      tabs: [
        "OPD Dashboard",
        "GCO Dashboard", 
        "INF Dashboard"
      ],
      components: [
        // OPD Dashboard Tab
        <div key="opd-dashboard" className="admin-office-dashboard">
          <div className="section-header">
            <h3>Office of the Prefect of Discipline - Dashboard View</h3>
          </div>
          <div className="dashboard-tables-grid">
            <div className="dashboard-table-section">
              <h4>Psychological Records (GCO)</h4>
              <OPDPsychologicalRecordsGCO
                userType="OPD"
                onRowClick={handleRowClick}
              />
            </div>
            <div className="dashboard-table-section">
              <h4>Medical Records (INF)</h4>
              <OPDMedicalRecordsINF
                userType="OPD"
                onRowClick={handleRowClick}
              />
            </div>
            <div className="dashboard-table-section">
              <h4>Psychological Records (INF)</h4>
              <OPDPsychologicalRecordsINF
                userType="OPD"
                onRowClick={handleRowClick}
              />
            </div>
          </div>
        </div>,
        
        // GCO Dashboard Tab
        <div key="gco-dashboard" className="admin-office-dashboard">
          <div className="section-header">
            <h3>Guidance Counseling Office - Dashboard View</h3>
          </div>
          <div className="dashboard-tables-grid">
            <div className="dashboard-table-section">
              <h4>Counseling Records</h4>
              <GCOCounselingRecords
                userType="GCO"
                onRowClick={handleRowClick}
              />
            </div>
          </div>
        </div>,
        
        // INF Dashboard Tab
        <div key="inf-dashboard" className="admin-office-dashboard">
          <div className="section-header">
            <h3>Infirmary - Dashboard View</h3>
          </div>
          <div className="dashboard-tables-grid">
            <div className="dashboard-table-section">
              <h4>Medical Records (INF)</h4>
              <OPDMedicalRecordsINF
                userType="INF"
                onRowClick={handleRowClick}
              />
            </div>
            <div className="dashboard-table-section">
              <h4>Psychological Records (GCO)</h4>
              <INFPsychologicalRecordsGCO
                userType="INF"
                onRowClick={handleRowClick}
              />
            </div>
          </div>
        </div>
      ]
    };
  };

  const { tabs, components } = getTabsConfig();

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`dashboard-container ${getOfficeClass()}`}>
      {/* Header/Nav Bar */}
      <DashboardNavigation
        userName={name}
        userType={type}
        userDepartment={department}
        onLogout={onLogout}
        onExitViewAs={handleExitViewAs}
      />

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Left Section - 80% */}
          <div className="dashboard-left">
            {/* Tally Analytics Section - Show all offices for Admin */}
            <div className="admin-tally-analytics">
              <h3>System Overview - All Offices</h3>
              <div className="tally-analytics-grid">
                <div className="tally-office-section">
                  <h4>OPD Analytics</h4>
                  <TallyAnalytics userType="OPD" />
                </div>
                <div className="tally-office-section">
                  <h4>GCO Analytics</h4>
                  <TallyAnalytics userType="GCO" />
                </div>
                <div className="tally-office-section">
                  <h4>INF Analytics</h4>
                  <TallyAnalytics userType="INF" />
                </div>
              </div>
            </div>

            {/* Dashboard Tables Section */}
            <div className="dashboard-tables">
              {/* Date Display */}
              <div className="date-guide-container">
                <div className="current-date">
                  {getCurrentDate()}
                </div>
                <div className="admin-view-indicator">
                  <span className="admin-badge">Admin View Mode</span>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="tabs-navigation">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    className={`tab-button ${activeTab === index ? 'active' : ''}`}
                    onClick={() => setActiveTab(index)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {components[activeTab]}
              </div>
            </div>
          </div>

          {/* Right Section - 20% */}
          <div className="dashboard-right">
            {/* Quick Actions for Admin */}
            <div className="sidebar-card">
              <h3>Administrator Quick Actions</h3>
              <QuickActions userType="Administrator" />
            </div>

            {/* Analytics Reports for all offices */}
            <div className="sidebar-card">
              <h3>Office Analytics Reports</h3>
              <div className="office-analytics-tabs">
                <div className="analytics-tab">
                  <h4>OPD Report</h4>
                  <AnalyticsReport userType="OPD" compact={true} />
                </div>
                <div className="analytics-tab">
                  <h4>GCO Report</h4>
                  <AnalyticsReport userType="GCO" compact={true} />
                </div>
                <div className="analytics-tab">
                  <h4>INF Report</h4>
                  <AnalyticsReport userType="INF" compact={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* View Record Modal */}
      <ViewRecordComponent
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        record={selectedRecord}
        type={viewType}
        onEdit={() => {}}
      />
      <div className="footer">
        <div className="footer-header"> DATA PRIVACY CLOSURE</div>
        <div className="footer-text">
          To the extent permitted or required by law, we share, disclose, or transfer the information mentioned above with the permission of the data subjects to specific entities, organizations, or offices such as the Guidance and Counselling Office, the Office of the Prefect of Discipline, the Physical Education Department, and the Head Moderator. This is for the purpose of determining eligibility in academic competitions, eligibility in sports, exemptions from strenuous activities, as well as other similar events. All information provided is confidential and shall not be copied, shared, distributed, and used for any other purposes. We will use the collected data solely for our legitimate purposes and for the proper handling of records.
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;