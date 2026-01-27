// src/components/forms/StudentInfoForm.js
import React from 'react';
import { FaIdCard, FaGraduationCap, FaCalendarAlt } from 'react-icons/fa';
import '../forms/FormStyles.css'; // Reuse existing form styles

const StudentInfoForm = ({ student, recordType }) => {
  const getRecordTitle = () => {
    switch (recordType) {
      case 'case': return 'Case Records';
      case 'counseling': return 'Counseling Sessions';
      case 'medical': return 'Medical Records';
      default: return 'Records';
    }
  };

  return (
    <div className="form-container student-info-form"> {/* Changed class from white-text to student-info-form */}
      <div className="form-sections-row">
        <div className="form-section">
          <h4>Student Information</h4>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="student-id">
                <FaIdCard /> ID Number
              </label>
              <input
                type="text"
                id="student-id"
                value={student?.id || ''}
                disabled
                className="disabled-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="student-name">Full Name</label>
              <input
                type="text"
                id="student-name"
                value={student?.name || ''}
                disabled
                className="disabled-input"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="student-strand">Strand</label>
              <input
                type="text"
                id="student-strand"
                value={student?.strand || ''}
                disabled
                className="disabled-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="student-grade">
                <FaGraduationCap /> Grade Level
              </label>
              <input
                type="text"
                id="student-grade"
                value={student?.gradeLevel || ''}
                disabled
                className="disabled-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="student-section">Section</label>
              <input
                type="text"
                id="student-section"
                value={student?.section || ''}
                disabled
                className="disabled-input"
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h4>Record Information</h4>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="record-count">Record Count</label>
              <input
                type="text"
                id="record-count"
                value={student?.caseCount || student?.counselingCount || student?.medicalCount || 0}
                disabled
                className="disabled-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="record-type">Record Type</label>
              <input
                type="text"
                id="record-type"
                value={getRecordTitle()}
                disabled
                className="disabled-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentInfoForm;