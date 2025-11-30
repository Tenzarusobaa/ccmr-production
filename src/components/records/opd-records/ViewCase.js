// ViewCase.js - Updated with edit button
import React, { useEffect, useState } from "react";
import "./ViewCase.css";

const ViewCase = ({ isOpen, onClose, record, onEditClick }) => {
  const [fullRecord, setFullRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.keyCode === 27) onClose();
    };

    if (isOpen && record) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      fetchFullRecordDetails();
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, record, onClose]);

  const fetchFullRecordDetails = async () => {
    if (!record || !record.caseNo) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/case-records/${record.caseNo}`);
      const data = await response.json();
      
      if (data.success) {
        setFullRecord(data.record);
      } else {
        console.error("Failed to fetch full record details:", data.error);
        setFullRecord(record);
      }
    } catch (error) {
      console.error("Error fetching full record details:", error);
      setFullRecord(record);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !record) return null;

  const displayRecord = fullRecord || record;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="back-btn" onClick={onClose}>
            ← Back
          </button>
          <button 
            className="edit-btn"
            onClick={() => onEditClick(displayRecord)}
          >
            Edit
          </button>
        </div>
        <h2>Case Record Details</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Loading record details...
          </div>
        ) : (
          <div className="view-record-container">
            {/* Student Information */}
            <div className="form-section two-columns">
              <div className="box">
                <h4>Student Information</h4>
                <div className="form-grid">
                  <label>Name</label>
                  <div className="view-field">{displayRecord.name || "N/A"}</div>
                  
                  <label>ID No.</label>
                  <div className="view-field">{displayRecord.id || "N/A"}</div>
                  
                  <label>Strand</label>
                  <div className="view-field">{displayRecord.strand || "N/A"}</div>
                  
                  <label>Grade Level</label>
                  <div className="view-field">{displayRecord.gradeLevel || "N/A"}</div>
                  
                  <label>Section</label>
                  <div className="view-field">{displayRecord.section || "N/A"}</div>
                </div>
              </div>

              <div className="box">
                <h4>Case Details</h4>
                <div className="form-grid">
                  <label>Case No.</label>
                  <div className="view-field">{displayRecord.caseNo || "N/A"}</div>
                  
                  <label>Date</label>
                  <div className="view-field">{displayRecord.date || "N/A"}</div>
                  
                  <label>Status</label>
                  <div className={`view-field status-${displayRecord.status?.toLowerCase()}`}>
                    {displayRecord.status || "N/A"}
                  </div>
                  
                  <label>Violation Level</label>
                  <div className="view-field">{displayRecord.violationLevel || "N/A"}</div>
                  
                  <label>Referred to GCO</label>
                  <div className="view-field">{displayRecord.referred || "No"}</div>
                </div>
              </div>
            </div>

            {/* General Description */}
            <div className="box">
              <h4>General Description</h4>
              <div className="view-textarea">
                {displayRecord.description || "No description provided"}
              </div>
            </div>

            {/* Additional Remarks */}
            <div className="box">
              <h4>Additional Remarks</h4>
              <div className="view-textarea">
                {displayRecord.remarks || "No remarks provided"}
              </div>
            </div>

            {/* Uploaded Files (if any) */}
            {(displayRecord.files && displayRecord.files.length > 0) && (
              <div className="box">
                <h4>Attached Files</h4>
                <div className="file-list">
                  {displayRecord.files.map((file, index) => (
                    <div key={index} className="file-item">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">({Math.round(file.size / 1024)} KB)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCase;