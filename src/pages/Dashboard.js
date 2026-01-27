// Dashboard.js - Updated to handle view modal and administrator view
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardNavigation from "../components/navigation/DashboardNavigation";
import "./Dashboard.css";
import ViewRecordComponent from "../components/modals/ViewRecordComponent";
import DemoOverlay from './DemoOverlay';
import AddButton from '../components/buttons/AddButton';

// Import table components
import OPDPsychologicalRecordsGCO from "../components/tables/dashboard-tables/OPDPsychologicalRecordsGCO";
import OPDMedicalRecordsINF from "../components/tables/dashboard-tables/OPDMedicalRecordsINF";
import OPDPsychologicalRecordsINF from "../components/tables/dashboard-tables/OPDPsychologicalRecordsINF";
import GCOCounselingRecords from "../components/tables/dashboard-tables/GCOCounselingRecords";
import INFPsychologicalRecordsGCO from "../components/tables/dashboard-tables/INFPsychologicalRecordsGCO";
import AnalyticsReport from '../components/analytics/AnalyticsReport';
import TallyAnalytics from '../components/analytics/TallyAnalytics';
import QuickActions from '../components/quick-actions/QuickActions';

const Dashboard = ({ userData, onLogout, onNavItemClick, onExitViewAs }) => {
  const location = useLocation();
  const department = userData?.department || localStorage.getItem('userDepartment') || 'Unknown Department';
  const type = userData?.type || localStorage.getItem('type') || 'Unknown Type';

  // Get viewType from location state or userData or localStorage or actual type
  const [viewType, setViewType] = useState(
    location.state?.viewType ||
    userData?.viewType ||
    localStorage.getItem('viewType') ||
    type
  );

  // Update viewType when location state changes
  useEffect(() => {
    if (location.state?.viewType) {
      setViewType(location.state.viewType);
      localStorage.setItem('viewType', location.state.viewType);
    }
  }, [location.state]);

  const name = userData?.name || localStorage.getItem('userName') || 'User';
  const [activeTab, setActiveTab] = useState(0);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Function to get office class - always use default for Administrator
  const getOfficeClass = () => {
    // If user is Administrator, always use default class
    if (type === "Administrator") {
      return "office-records-default";
    }
    
    // For regular users, use their office class
    switch (viewType) {
      case "OPD": return "office-records-opd";
      case "GCO": return "office-records-gco";
      case "INF": return "office-records-inf";
      default: return "office-records-default";
    }
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

  // Function to handle edit (you can implement this later)
  const handleEditRecord = (record) => {
    console.log('Edit record:', record);
    // You can implement edit functionality here
  };

  // Handle exit view as for Administrator
  const handleExitViewAs = () => {
    setViewType("Administrator");
    localStorage.removeItem('viewType');
    if (onExitViewAs) {
      onExitViewAs();
    }
  };

  // Define tabs and components based on effective user type
  const getTabsConfig = () => {
    // Administrator users should not see the regular dashboard
    // They should be redirected to the AdministratorDashboard
    if (viewType === "Administrator") {
      // Instead of showing content here, we'll show a message
      // In practice, Administrators should be using /administrator route
      return {
        tabs: ["System Overview"],
        components: [
          <div key="admin-redirect" className="admin-dashboard-content">
            <h2>Administrator Dashboard</h2>
            <p>You are logged in as an Administrator.</p>
            <p>For user management and system administration, please use the Account Management link in the navigation.</p>
            <div className="admin-stats">
              <div className="stat-card">
                <h3>System Access</h3>
                <p>Use the navigation above to view different offices or manage user accounts.</p>
              </div>
            </div>
          </div>
        ]
      };
    }
    
    switch (viewType) {
      case "OPD":
        return {
          tabs: [
            "Psychological Records (GCO)",
            "Medical Records (INF)",
            "Psychological Records (INF)"
          ],
          components: [
            <OPDPsychologicalRecordsGCO
              key="psych-gco"
              userType={viewType}
              onRowClick={handleRowClick}
            />,
            <OPDMedicalRecordsINF
              key="medical-inf"
              userType={viewType}
              onRowClick={handleRowClick}
            />,
            <OPDPsychologicalRecordsINF
              key="psych-inf"
              userType={viewType}
              onRowClick={handleRowClick}
            />
          ]
        };
      case "GCO":
        return {
          tabs: ["Counseling Records"],
          components: [
            <GCOCounselingRecords
              key="counseling"
              userType={viewType}
              onRowClick={handleRowClick}
            />
          ]
        };
      case "INF":
        return {
          tabs: [
            "Medical Records (INF)",
            "Psychological Records (GCO)"
          ],
          components: [
            <OPDMedicalRecordsINF
              key="medical-inf"
              userType={viewType}
              onRowClick={handleRowClick}
            />,
            <INFPsychologicalRecordsGCO
              key="psych-gco"
              userType={viewType}
              onRowClick={handleRowClick}
            />
          ]
        };
      default:
        return {
          tabs: ["Records"],
          components: [<div key="default">Default Table Component</div>]
        };
    }
  };

  const { tabs, components } = getTabsConfig();

  const handleOpenGuide = () => {
    window.open('https://docs.google.com/document/d/1FGG963aQ50fCjSXzJR-1mOuzW7FldZCS/edit?usp=sharing&ouid=108651438848254952190&rtpof=true&sd=true', '_blank');
  };

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
      {/* <DemoOverlay /> */}
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
            {/* Tally Analytics Section - Only show for office views */}
            {viewType !== "Administrator" && (
              <TallyAnalytics userType={viewType} />
            )}

            {/* Dashboard Tables Section */}
            <div className="dashboard-tables">
              {/* Date and Guide Button */}
              <div className="date-guide-container">
                <div className="current-date">
                  {getCurrentDate()}
                </div>
                <AddButton
                    onClick={handleOpenGuide}
                    label="User Guide"
                    title="Open User Guide"
                    type={viewType}
                  />
              </div>

              {/* Tabs Navigation - Only show tabs if not Administrator */}
              {viewType !== "Administrator" ? (
                <>
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
                </>
              ) : (
                /* Administrator Dashboard Content - Now simplified */
                <div className="admin-dashboard-main">
                  {components[0]}
                </div>
              )}
            </div>
          </div>

          {/* Right Section - 20% */}
          <div className="dashboard-right">
            {viewType === "GCO" ? (
              <>
                {/* Quick Actions for GCO users */}
                <div className="sidebar-card">
                  <h3>Analytics Report</h3>
                  <QuickActions userType={viewType} />
                </div>

                <div className="sidebar-card">
                  <h3>Analytics Report</h3>
                  <AnalyticsReport userType={viewType} />
                </div>
              </>
            ) : viewType === "Administrator" ? (
              /* For Administrator, show system stats */
              <div className="sidebar-card">
                <h3>System Statistics</h3>
                <div className="admin-system-stats">
                  <div className="system-stat">
                    <span className="stat-label">Total Users:</span>
                    <span className="stat-value">--</span>
                  </div>
                  <div className="system-stat">
                    <span className="stat-label">Active Sessions:</span>
                    <span className="stat-value">--</span>
                  </div>
                  <div className="system-stat">
                    <span className="stat-label">Last Backup:</span>
                    <span className="stat-value">--</span>
                  </div>
                </div>
              </div>
            ) : (
              /* For OPD and INF users, show only Analytics Report */
              <div className="sidebar-card">
                <h3>Analytics Report</h3>
                <AnalyticsReport userType={viewType} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* View Record Modal */}
      <ViewRecordComponent
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        record={selectedRecord}
        type={viewType}
        onEdit={handleEditRecord}
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

export default Dashboard;