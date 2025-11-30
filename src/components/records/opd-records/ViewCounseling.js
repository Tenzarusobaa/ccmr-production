// Updated ViewCounseling.js to include UNCONFIRMED psychological condition
import React, { useEffect, useState } from "react";
import "./ViewCounseling.css";

const ViewCounseling = ({ isOpen, onClose, record, onEditClick }) => {
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
      const response = await fetch(`http://localhost:5000/api/counseling-records/${record.recordId}`);
      const data = await response.json();
      
      if (data.success) {
        setFullRecord(data.record);
      } else {
        console.error("Failed to fetch full counseling record details:", data.error);
        setFullRecord(record);
      }
    } catch (error) {
      console.error("Error fetching full counseling record details:", error);
      setFullRecord(record);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !record) return null;

  const displayRecord = fullRecord || record;

  // Function to display psychological condition text
  const getPsychologicalConditionText = (value) => {
    switch (value) {
      case 'YES': return 'Yes';
      case 'NO': return 'No';
      case 'UNCONFIRMED': return 'Unconfirmed';
      default: return 'N/A';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="back-btn" onClick={onClose}>
            ← Back
          </button>
        </div>
        <h2>Counseling Record Details</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Loading record details...
          </div>
        ) : (
          <div className="view-record-container">
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
                <h4>Session Details</h4>
                <div className="form-grid">
                  <label>Record No.</label>
                  <div className="view-field">{displayRecord.recordId || "N/A"}</div>
                  
                  <label>Session No.</label>
                  <div className="view-field">{displayRecord.sessionNumber || "N/A"}</div>
                  
                  <label>Status</label>
                  <div className={`view-field status-${displayRecord.status?.toLowerCase().replace(' ', '-')}`}>
                    {displayRecord.status || "N/A"}
                  </div>
                  
                  <label>Date</label>
                  <div className="view-field">{displayRecord.date || "N/A"}</div>
                  
                  <label>Time</label>
                  <div className="view-field">{displayRecord.time || "N/A"}</div>
                </div>
              </div>
            </div>

            <div className="box">
              <h4>General Concern</h4>
              <div className="view-textarea">
                {displayRecord.concern || "No concern provided"}
              </div>
            </div>

            <div className="box">
              <h4>Additional Remarks</h4>
              <div className="view-textarea">
                {displayRecord.remarks || "No remarks provided"}
              </div>
            </div>

            <div className="box">
              <h4>Psychological Assessment</h4>
              <div className="form-grid">
                <label>Psychological Condition</label>
                <div className="view-field">
                  {getPsychologicalConditionText(displayRecord.psychologicalCondition)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCounseling;