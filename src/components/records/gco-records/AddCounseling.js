// Updated AddCounseling.js with student ID autocomplete and UNCONFIRMED option
import React, { useEffect, useState } from "react";
import "./AddCounseling.css";

const AddCounseling = ({ isOpen, onClose, onRecordAdded }) => {
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    strand: "",
    gradeLevel: "",
    section: "",
    sessionNumber: "",
    status: "TO SCHEDULE",
    date: "",
    time: "",
    concern: "",
    remarks: "",
    psychologicalCondition: "UNCONFIRMED" // Changed default to UNCONFIRMED
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentSuggestions, setStudentSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.keyCode === 27) onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Fetch student suggestions based on ID input
  const fetchStudentSuggestions = async (query) => {
    if (query.length < 3) {
      setStudentSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/students/search?id=${query}`);
      const data = await response.json();
      
      if (data.success) {
        setStudentSuggestions(data.students);
        setShowSuggestions(data.students.length > 0);
      }
    } catch (error) {
      console.error("Error fetching student suggestions:", error);
      setStudentSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If student ID is being changed, fetch suggestions
    if (name === "studentId") {
      fetchStudentSuggestions(value);
    }
  };

  const handleStudentSelect = (student) => {
    setFormData(prev => ({
      ...prev,
      studentId: student.sd_id_number,
      studentName: student.sd_student_name,
      strand: student.sd_strand,
      gradeLevel: student.sd_grade_level,
      section: student.sd_section
    }));
    
    setStudentSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("http://localhost:5000/api/counseling-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Reset form
        setFormData({
          studentId: "",
          studentName: "",
          strand: "",
          gradeLevel: "",
          section: "",
          sessionNumber: "",
          status: "TO SCHEDULE",
          date: "",
          time: "",
          concern: "",
          remarks: "",
          psychologicalCondition: "UNCONFIRMED" // Reset to UNCONFIRMED
        });
        
        // Notify parent component
        if (onRecordAdded) {
          onRecordAdded();
        }
        
        // Close the overlay
        onClose();
      } else {
        alert("Error adding counseling record: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the counseling record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <button className="back-btn" onClick={onClose}>
          ← Back
        </button>
        <h2>Add Counseling Record</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-section two-columns">
            <div className="box">
              <h4>Student Information</h4>
              <div className="form-grid">
                <label>ID No.</label>
                <div style={{position: 'relative'}}>
                  <input 
                    type="text" 
                    name="studentId"
                    value={formData.studentId} 
                    onChange={handleInputChange}
                    required 
                    autoComplete="off"
                  />
                  {showSuggestions && (
                    <div className="suggestions-dropdown">
                      {studentSuggestions.map((student, index) => (
                        <div 
                          key={index}
                          className="suggestion-item"
                          onClick={() => handleStudentSelect(student)}
                        >
                          {student.sd_id_number} - {student.sd_student_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <label>Name</label>
                <input 
                  type="text" 
                  name="studentName"
                  value={formData.studentName} 
                  onChange={handleInputChange}
                  required 
                />
                <label>Strand</label>
                <select 
                  name="strand"
                  value={formData.strand} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Strand</option>
                  <option value="STEM">STEM</option>
                  <option value="ABM">ABM</option>
                  <option value="HUMSS">HUMSS</option>
                  <option value="GAS">GAS</option>
                  <option value="TVL">TVL</option>
                </select>
                <label>Grade Level</label>
                <select 
                  name="gradeLevel"
                  value={formData.gradeLevel} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Grade Level</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
                <label>Section</label>
                <input 
                  type="text" 
                  name="section"
                  value={formData.section} 
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>

            <div className="box">
              <h4>Session Details</h4>
              <div className="form-grid">
                <label>Session No.</label>
                <input 
                  type="number" 
                  name="sessionNumber"
                  value={formData.sessionNumber} 
                  onChange={handleInputChange}
                  required 
                />
                <label>Status</label>
                <select 
                  name="status"
                  value={formData.status} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="TO SCHEDULE">TO SCHEDULE</option>
                  <option value="SCHEDULED">SCHEDULED</option>
                  <option value="DONE">DONE</option>
                </select>
                <label>Date</label>
                <input 
                  type="date" 
                  name="date"
                  value={formData.date} 
                  onChange={handleInputChange}
                />
                <label>Time</label>
                <input 
                  type="time" 
                  name="time"
                  value={formData.time} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="box">
            <h4>General Concern</h4>
            <textarea
              name="concern"
              rows="4"
              maxLength="500"
              value={formData.concern}
              onChange={handleInputChange}
              required
            />
            <div className="char-limit">Max 500 characters</div>
          </div>

          <div className="box">
            <h4>Additional Remarks</h4>
            <textarea
              name="remarks"
              rows="2"
              maxLength="500"
              value={formData.remarks}
              onChange={handleInputChange}
            />
            <div className="char-limit">Max 500 characters</div>
          </div>

          <div className="box">
            <h4>Psychological Assessment</h4>
            <div className="form-grid">
              <label>Psychological Condition</label>
              <select 
                name="psychologicalCondition"
                value={formData.psychologicalCondition} 
                onChange={handleInputChange}
                required
              >
                <option value="UNCONFIRMED">Unconfirmed</option>
                <option value="NO">No</option>
                <option value="YES">Yes</option>
              </select>
            </div>
          </div>

          <div className="actions">
            <button 
              type="submit" 
              className="save-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "SAVING..." : "SAVE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCounseling;