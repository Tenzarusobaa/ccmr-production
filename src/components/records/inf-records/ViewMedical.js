// ViewMedical.js
import React, { useEffect, useState } from "react";
import "./ViewCase.css";

const ViewMedical = ({ isOpen, onClose, record, onEditClick }) => {
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
    if (!record || !record.recordId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/medical-records/${record.recordId}`);
      const data = await response.json();
      
      if (data.success) {
        setFullRecord(data.record);
      } else {
        console.error("Failed to fetch full medical record details:", data.error);
        setFullRecord(record);
      }
    } catch (error) {
      console.error("Error fetching full medical record details:", error);
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
        <h2>Medical Record Details</h2>

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
                <h4>Record Details</h4>
                <div className="form-grid">
                  <label>Record No.</label>
                  <div className="view-field">{displayRecord.recordId || "N/A"}</div>
                  
                  <label>Date</label>
                  <div className="view-field">{displayRecord.date || "N/A"}</div>
                  
                  <label>Subject</label>
                  <div className="view-field">{displayRecord.subject || "N/A"}</div>
                  
                  <label>Status</label>
                  <div className="view-field">{displayRecord.status || "N/A"}</div>
                  
                  <label>Psychological Condition</label>
                  <div className="view-field">{displayRecord.isPsychological || "No"}</div>
                  
                  <label>Medical Condition</label>
                  <div className="view-field">{displayRecord.isMedical || "No"}</div>
                  
                  <label>Referred to GCO</label>
                  <div className="view-field">{displayRecord.referred || "No"}</div>
                  
                  <label>Referral Status</label>
                  <div className="view-field">{displayRecord.referralConfirmation || "N/A"}</div>
                </div>
              </div>
            </div>

            {/* Medical Details */}
            <div className="box">
              <h4>Medical Details</h4>
              <div className="view-textarea">
                {displayRecord.medicalDetails || "No details provided"}
              </div>
            </div>

            {/* Additional Remarks */}
            <div className="box">
              <h4>Additional Remarks</h4>
              <div className="view-textarea">
                {displayRecord.remarks || "No additional remarks"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewMedical;