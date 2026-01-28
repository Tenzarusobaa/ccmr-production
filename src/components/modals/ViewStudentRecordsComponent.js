// src/components/modals/ViewStudentRecordsComponent.js
import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaFolder, FaStethoscope, FaComments, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import StudentInfoForm from '../forms/StudentInfoForm';
import ViewRecordComponent from './ViewRecordComponent';
import EditRecordComponent from './EditRecordComponent';
import AddRecordComponent from './AddRecordComponent';
import './Modal.css';
import './ViewStudentRecordsComponent.css';
import AddButton from '../buttons/AddButton';

const API_BASE_URL = process.env.REACT_APP_NODE_SERVER_URL || 'http://localhost:5000/';

const ViewStudentRecordsComponent = ({ isOpen, onClose, student, type, recordType }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editRecordData, setEditRecordData] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('ALL'); // For INF medical records filter

  useEffect(() => {
    if (isOpen && student) {
      fetchStudentRecords();
      setExpandedSections({});
      setSortConfig({ key: null, direction: 'asc' });
      setSelectedRecord(null);
      setShowViewModal(false);
      setShowEditModal(false);
      setShowAddModal(false);
      setEditRecordData(null);
    }
  }, [isOpen, student]);

  const fetchStudentRecords = async () => {
    try {
      setLoading(true);
      setError(null);

      let endpoint;

      // Apply filtering based on user type and record type
      switch (recordType) {
        case 'case':
          // For case records:
          // - OPD users see all records
          // - GCO users only see referred records (referred = 'Yes')
          if (type === "GCO") {
            endpoint = `${API_BASE_URL}api/case-records/student/${student.id}?referred=true`;
          } else {
            endpoint = `${API_BASE_URL}api/case-records/student/${student.id}`;
          }
          break;
        case 'counseling':
          // For counseling records:
          // - GCO users see all counseling records
          // - INF users only see psychological records (isPsychological = 'Yes')
          if (type === "INF") {
            endpoint = `${API_BASE_URL}api/counseling-records/student/${student.id}?psychological=true`;
          } else {
            endpoint = `${API_BASE_URL}api/counseling-records/student/${student.id}`;
          }
          break;
        case 'medical':
          // For medical records:
          // - INF users see all medical records (with filter option)
          // - GCO users only see referred medical records (referred = 'Yes')
          if (type === "GCO") {
            endpoint = `${API_BASE_URL}api/medical-records/student/${student.id}?referred=true`;
          } else {
            endpoint = `${API_BASE_URL}api/medical-records/student/${student.id}`;
          }
          break;
        default:
          return;
      }

      console.log(`Fetching records from: ${endpoint}`);
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Apply additional filtering for INF viewing GCO records
        let filteredRecords = data.records || [];

        if (type === "INF" && recordType === "counseling") {
          // INF should only see psychological counseling records
          filteredRecords = filteredRecords.filter(record =>
            record.psychologicalCondition === "YES" ||
            record.isPsychological === "Yes"
          );
        }

        if (type === "GCO" && recordType === "case") {
          // GCO should only see referred case records
          filteredRecords = filteredRecords.filter(record =>
            record.referred === "Yes"
          );
        }

        if (type === "GCO" && recordType === "medical") {
          // GCO should only see referred medical records
          filteredRecords = filteredRecords.filter(record =>
            record.referred === "Yes"
          );
        }

        setRecords(filteredRecords);
      } else {
        throw new Error(data.error || 'Failed to fetch records');
      }
    } catch (err) {
      console.error('Error fetching student records:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle sorting
  const handleSort = (sortConfig) => {
    setSortConfig(sortConfig);
  };

  // Sort records based on sortConfig
  const sortedRecords = React.useMemo(() => {
    if (!sortConfig.key) return records;

    return [...records].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
      if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;

      // Handle dates
      if (sortConfig.key === 'date') {
        const dateA = new Date(a.date || '1970-01-01');
        const dateB = new Date(b.date || '1970-01-01');
        return sortConfig.direction === 'asc'
          ? dateA - dateB
          : dateB - dateA;
      }

      // Handle numeric fields
      if (sortConfig.key === 'caseNo' || sortConfig.key === 'sessionNumber' || sortConfig.key === 'recordId') {
        const aNum = parseInt(aValue, 10);
        const bNum = parseInt(bValue, 10);
        if (isNaN(aNum) && isNaN(bNum)) return 0;
        if (isNaN(aNum)) return sortConfig.direction === 'asc' ? -1 : 1;
        if (isNaN(bNum)) return sortConfig.direction === 'asc' ? 1 : -1;

        return sortConfig.direction === 'asc'
          ? aNum - bNum
          : bNum - aNum;
      }

      // Handle strings
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Default comparison
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [records, sortConfig]);

  const getSortIndicator = (columnKey) => {
    if (!sortConfig || sortConfig.key !== columnKey) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const handleAddRecord = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    fetchStudentRecords();
  };

  const handleRecordAdded = () => {
    setShowAddModal(false);
    fetchStudentRecords();
  };

  const handleRowClick = (record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedRecord(null);
  };

  const handleEditRecord = (record) => {
    setSelectedRecord(null);
    setShowViewModal(false);
    setEditRecordData(record);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditRecordData(null);
    fetchStudentRecords();
  };

  const handleRecordUpdated = (updatedRecord) => {
    fetchStudentRecords();
    setShowEditModal(false);
    setEditRecordData(null);
  };

  if (!isOpen || !student) return null;

  const getRecordIcon = () => {
    switch (recordType) {
      case 'case': return <FaFolder />;
      case 'counseling': return <FaComments />;
      case 'medical': return <FaStethoscope />;
      default: return <FaFolder />;
    }
  };

  const getRecordTitle = () => {
    switch (recordType) {
      case 'case':
        return type === "GCO" ? 'Referred Case Records' : 'Case Records';
      case 'counseling':
        return type === "INF" ? 'Psychological Records' : 'Counseling Sessions';
      case 'medical':
        return type === "GCO" ? 'Referred Medical Records' : 'Medical Records';
      default: return 'Records';
    }
  };

  const getRecordColumns = () => {
    switch (recordType) {
      case 'case':
        return [
          { key: 'caseNo', label: 'Case No.', sortable: true },
          type === "GCO"
            ? { key: 'remarks', label: 'Additional Remarks', sortable: false }
            : { key: 'description', label: 'General Description', sortable: false },
          { key: 'violationLevel', label: 'Severity', sortable: true },
          {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (value) => (
              <span className={`status-badge status-${value?.toLowerCase() || 'unknown'}`}>
                {value}
              </span>
            )
          },
          { key: 'referred', label: 'Referred to GCO', sortable: true },
          { key: 'date', label: 'Date', sortable: true }
        ];
      case 'counseling':
        return [
          { key: 'sessionNumber', label: 'Session No.', sortable: true },
          // REMOVED: id, name, strand columns
          {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (value) => (
              <span className={`status-badge status-${value?.toLowerCase() || 'unknown'}`}>
                {value}
              </span>
            )
          },
          { key: 'concern', label: 'General Concern', sortable: false }, // Changed from 'psychologicalCondition'
          { key: 'date', label: 'Date', sortable: true }
        ];
      case 'medical':
        return [
          { key: 'recordId', label: 'Record No.', sortable: true },
          // REMOVED: id, name, strand columns
          {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (value) => (
              <span className={`status-badge status-${value?.toLowerCase() || 'unknown'}`}>
                {value}
              </span>
            )
          },
          type === "GCO"
            ? { key: 'remarks', label: 'Additional Remarks', sortable: false }
            : { key: 'medicalDetails', label: 'Medical Details', sortable: false },
          { key: 'referred', label: 'Referred to GCO', sortable: true },
          { key: 'isPsychological', label: 'Psychological', sortable: true },
          { key: 'isMedical', label: 'Medical', sortable: true },
          { key: 'date', label: 'Date', sortable: true }
        ];
      default:
        return [];
    }
  };

  const groupedRecords = sortedRecords.reduce((groups, record) => {
    const key = record.schoolYearSemester || 'No Semester';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(record);
    return groups;
  }, {});

  const sortedSemesters = Object.keys(groupedRecords).sort((a, b) => {
    if (a === 'No Semester') return 1;
    if (b === 'No Semester') return -1;

    const parseSemester = (semester) => {
      const parts = semester.split('-');
      const schoolYear = parts.slice(0, 2).join('-');
      const semesterNum = parseInt(parts[2] || '0');
      return { schoolYear, semesterNum };
    };

    const aSem = parseSemester(a);
    const bSem = parseSemester(b);

    if (aSem.schoolYear !== bSem.schoolYear) {
      return bSem.schoolYear.localeCompare(aSem.schoolYear);
    }

    return bSem.semesterNum - aSem.semesterNum;
  });

  const toggleSection = (semester) => {
    setExpandedSections(prev => ({
      ...prev,
      [semester]: !prev[semester]
    }));
  };

  // Get background color based on user type (not record type)
  const getOfficeClass = () => {
    switch (type) {
      case "OPD": return "office-opd";
      case "GCO": return "office-gco";
      case "INF": return "office-inf";
      default: return "office-default";
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content modal-wide">
          <div className="modal-header">
            <div className="modal-title">
              {type === "OPD" && recordType === "case" && (
                <AddButton onClick={handleAddRecord} type={type} />
              )}
              {type === "GCO" && recordType === "counseling" && (
                <AddButton onClick={handleAddRecord} type={type} />
              )}
              {type === "INF" && recordType === "medical" && (
                <AddButton onClick={handleAddRecord} type={type} />
              )}
            </div>
            <button className="modal-close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <div className="modal-body">
            <div className={`student-info-section ${getOfficeClass()}`}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <FaUser /> {student?.name}
              </h3>
              <StudentInfoForm student={student} recordType={recordType} />
            </div>

            <div className={`records-section ${recordType}`}>
              <h3
                className={getOfficeClass()}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}
              >
                {getRecordIcon()} {getRecordTitle()} ({sortedRecords.length})
              </h3>

              {loading ? (
                <div className="loading-state">Loading records...</div>
              ) : error ? (
                <div className="error-state">Error: {error}</div>
              ) : sortedRecords.length === 0 ? (
                <div className="empty-state">
                  No records found for this student
                  {type === "GCO" && recordType === "case" && " (only shows referred cases)"}
                  {type === "INF" && recordType === "counseling" && " (only shows psychological records)"}
                  {type === "GCO" && recordType === "medical" && " (only shows referred medical records)"}
                </div>
              ) : (
                <div className="records-list">
                  {sortedSemesters.map(semester => {
                    const isExpanded = expandedSections[semester] || false;
                    const semesterRecords = groupedRecords[semester] || [];
                    const columns = getRecordColumns();

                    return (
                      <div key={semester} className="semester-section">
                        <button
                          className={`semester-header ${getOfficeClass()} ${isExpanded ? 'expanded' : ''}`}
                          onClick={() => toggleSection(semester)}
                        >
                          <span>{semester} ({semesterRecords.length} records)</span>
                          <span>
                            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="semester-records">
                            <div className="table-scroll-container">
                              <table className="data-table">
                                <thead>
                                  <tr>
                                    {columns.map((column) => (
                                      <th
                                        key={column.key}
                                        onClick={() => column.sortable && handleSort({
                                          key: column.key,
                                          direction: sortConfig.key === column.key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                                        })}
                                        className={column.sortable ? 'sortable' : ''}
                                      >
                                        <span className="column-header-content">
                                          {column.label}
                                          {column.sortable && (
                                            <span className="sort-indicator">
                                              {getSortIndicator(column.key)}
                                            </span>
                                          )}
                                        </span>
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {semesterRecords.map((record, index) => (
                                    <tr
                                      key={record.caseNo || record.sessionNumber || record.recordId || `row-${index}`}
                                      onClick={() => handleRowClick(record)}
                                      className="clickable-row"
                                      style={{ cursor: 'pointer' }}
                                    >
                                      {columns.map((column) => (
                                        <td key={column.key}>
                                          {column.render ? column.render(record[column.key], record) : record[column.key]}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>

      <AddRecordComponent
        isOpen={showAddModal}
        onClose={handleCloseAddModal}
        onRecordAdded={handleRecordAdded}
        type={type}
        student={student}
        recordType={recordType}
      />

      <ViewRecordComponent
        isOpen={showViewModal}
        onClose={handleCloseViewModal}
        record={selectedRecord}
        type={type}
        onEdit={handleEditRecord}
      />

      <EditRecordComponent
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onRecordUpdated={handleRecordUpdated}
        type={type}
        record={editRecordData}
      />
    </>
  );
};

export default ViewStudentRecordsComponent;