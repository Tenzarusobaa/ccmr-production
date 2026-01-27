// src/pages/AdminVIEW/AdminStudentData.js
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '../../components/navigation/NavBar';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import SearchBar from '../../components/search/SearchBar';
import DataTable from '../../components/tables/DataTable';
import { FaUser, FaShieldAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../OfficeRecords.css';

const AdminStudentData = ({ userData, onLogout, onNavItemClick, onExitViewAs }) => {
  const location = useLocation();
  const name = userData?.name || localStorage.getItem('userName') || 'User';
  const department = userData?.department || localStorage.getItem('userDepartment') || 'Administrator';
  const type = userData?.type || localStorage.getItem('type') || 'Administrator';
  
  // Force viewType to be Administrator for admin view pages
  const viewType = "Administrator";

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterConfig, setFilterConfig] = useState({
    strand: '',
    gradeLevel: '',
    gender: ''
  });
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [currentSemesterIndex, setCurrentSemesterIndex] = useState(0);

  const API_BASE = "http://localhost:5000/api";

  // Use default styling for admin view
  const getOfficeClass = () => "office-records-default";

  const getTitle = () => {
    const currentSemester = availableSemesters[currentSemesterIndex] || 'Loading...';
    return `Student Data (Admin View): < ${currentSemester} >`;
  };

  // Make columns sortable
  const studentColumns = [
    { key: 'id', label: 'ID Number', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'strand', label: 'Strand', sortable: true },
    { key: 'gradeLevel', label: 'Grade Level', sortable: true },
    { key: 'schoolYearSemesterr', label: 'School Year/Sem', sortable: true },
    { key: 'section', label: 'Section', sortable: true },
    { key: 'gender', label: 'Gender', sortable: true }
  ];

  // Get unique values for filter dropdowns and semesters
  const uniqueValues = useMemo(() => {
    // Extract all unique schoolYearSemesterr values
    const semesters = [...new Set(students
      .map(student => student.schoolYearSemesterr)
      .filter(Boolean)
      .sort()
    )];
    
    return {
      strands: [...new Set(students.map(student => student.strand).filter(Boolean))],
      gradeLevels: [...new Set(students.map(student => student.gradeLevel).filter(Boolean))],
      genders: [...new Set(students.map(student => student.gender).filter(Boolean))],
      semesters: semesters
    };
  }, [students]);

  // Update available semesters when unique values change
  useEffect(() => {
    if (uniqueValues.semesters.length > 0) {
      setAvailableSemesters(uniqueValues.semesters);
      // Set current semester to the latest one
      setCurrentSemesterIndex(uniqueValues.semesters.length - 1);
    }
  }, [uniqueValues.semesters]);

  // Apply filters and sorting
  const filteredAndSortedStudents = useMemo(() => {
    const currentSemester = availableSemesters[currentSemesterIndex];
    
    let filtered = students.filter(student => {
      const semesterMatch = !currentSemester || student.schoolYearSemesterr === currentSemester;
      return (
        semesterMatch &&
        (!filterConfig.strand || student.strand === filterConfig.strand) &&
        (!filterConfig.gradeLevel || student.gradeLevel === filterConfig.gradeLevel) &&
        (!filterConfig.gender || student.gender === filterConfig.gender)
      );
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle null/undefined values
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
        if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;

        // Handle different data types
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // For numbers and other types
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [students, availableSemesters, currentSemesterIndex, filterConfig, sortConfig]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/student-data`);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.success) {
        setStudents(data.students || []);
      } else {
        throw new Error(data.error || 'Failed to fetch student data');
      }
    } catch (err) {
      console.error('Error fetching student data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      fetchStudents();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/student-data/search?query=${encodeURIComponent(searchQuery)}`);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.success) {
        setStudents(data.students || []);
      } else {
        throw new Error(data.error || 'Search failed');
      }
    } catch (err) {
      console.error('Error searching student data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (sortConfig) => {
    setSortConfig(sortConfig);
  };

  const handleFilterChange = (filterType, value) => {
    setFilterConfig(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilterConfig({
      strand: '',
      gradeLevel: '',
      gender: ''
    });
  };

  // Semester navigation functions
  const handlePreviousSemester = () => {
    if (currentSemesterIndex > 0) {
      setCurrentSemesterIndex(prev => prev - 1);
    }
  };

  const handleNextSemester = () => {
    if (currentSemesterIndex < availableSemesters.length - 1) {
      setCurrentSemesterIndex(prev => prev + 1);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleRowClick = (student) => {
    console.log('Student clicked:', student);
    // Admin can view but not edit student data
  };

  if (loading && students.length === 0) {
    return (
      <div className={`office-records-container ${getOfficeClass()}`}>
        <NavBar userDepartment={department} userType={type} userName={name} onLogout={onLogout} onNavItemClick={onNavItemClick} />
        <div className="office-records-header">
          <Breadcrumbs />
          <hr />
          <h2><FaUser /> {getTitle()}</h2>
        </div>
        <div className="content">
          <div className="loading-state">Loading student data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`office-records-container ${getOfficeClass()}`}>
      <NavBar
        userDepartment={department}
        userType={type}
        userName={name}
        onLogout={onLogout}
        onNavItemClick={onNavItemClick}
      />
      
      <div className="office-records-header">
        <Breadcrumbs />
        <hr />
        <div className="header-flex">
          <div className="header-left">
            <h2>
              <FaUser /> Student Data (Admin View):
              <div className="semester-navigation">
                <button 
                  onClick={handlePreviousSemester}
                  disabled={currentSemesterIndex === 0 || loading}
                  className="semester-nav-button"
                >
                  <FaChevronLeft />
                </button>
                <span className="current-semester">
                  {availableSemesters[currentSemesterIndex] || '2025-2026-1'}
                </span>
                <button 
                  onClick={handleNextSemester}
                  disabled={currentSemesterIndex === availableSemesters.length - 1 || loading}
                  className="semester-nav-button"
                >
                  <FaChevronRight />
                </button>
              </div>
            </h2>
            {loading && <div className="loading-indicator">Updating...</div>}
          </div>
          <div className="header-right" style={{ display: 'flex', alignItems: 'center' }}>
            <SearchBar onSearch={handleSearch} disabled={loading} />
          </div>
        </div>
      </div>

      <div className="content">
        {error && (
          <div className="error-banner">
            Error: {error}
            <button onClick={fetchStudents} className="retry-button-small">
              Retry
            </button>
          </div>
        )}
        
        
        <DataTable
          data={filteredAndSortedStudents}
          columns={studentColumns}
          type={viewType}
          onRowClick={handleRowClick}
          onSort={handleSort}
          sortConfig={sortConfig}
          loading={loading}
        />
        {filteredAndSortedStudents.length === 0 && !loading && (
          <div className="no-data">No student records found for this semester.</div>
        )}
      </div>

      <div className="footer">
        <div className="footer-header"><FaShieldAlt /> DATA PRIVACY CLOSURE</div>
        <div className="footer-text">
          To the extent permitted or required by law, we share, disclose, or transfer the information mentioned above with the permission of the data subjects to specific entities, organizations, or offices such as the Guidance and Counselling Office, the Office of the Prefect of Discipline, the Physical Education Department, and the Head Moderator. This is for the purpose of determining eligibility in academic competitions, eligibility in sports, exemptions from strenuous activities, as well as other similar events. All information provided is confidential and shall not be copied, shared, distributed, and used for any other purposes. We will use the collected data solely for our legitimate purposes and for the proper handling of records.
        </div>
      </div>
    </div>
  );
};

export default AdminStudentData;