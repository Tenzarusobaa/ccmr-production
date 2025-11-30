// Updated EditCase.js with student ID autocomplete
import React, { useEffect, useState } from "react";
import "./AddCase.css"; // Reuse the same CSS

const EditCase = ({ isOpen, onClose, record, onRecordUpdated }) => {
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    strand: "",
    gradeLevel: "",
    section: "",
    violationLevel: "Minor Offense",
    status: "ON GOING",
    description: "",
    remarks: "",
    referredToGCO: false,
    files: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentSuggestions, setStudentSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.keyCode === 27) onClose();
    };

    if (isOpen && record) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      
      // Pre-populate form with record data
      setFormData({
        studentId: record.id || "",
        studentName: record.name || "",
        strand: record.strand || "",
        gradeLevel: record.gradeLevel || "",
        section: record.section || "",
        violationLevel: record.violationLevel || "Minor Offense",
        status: record.status === "Resolved" ? "RESOLVED" : "ON GOING",
        description: record.description || "",
        remarks: record.remarks || "",
        referredToGCO: record.referred === "Yes",
        files: []
      });
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, record, onClose]);

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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const validTypes = ["image/png", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      const isValidType = validTypes.includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        alert(`File ${file.name} is not a valid type. Only PNG, PDF, and DOCX are allowed.`);
        return false;
      }
      
      if (!isValidSize) {
        alert(`File ${file.name} exceeds the 5MB size limit.`);
        return false;
      }
      
      return true;
    });
    
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare form data for submission
      const { files, ...dataWithoutFiles } = formData;
      
      // Convert status to match database enum values
      const dbStatus = dataWithoutFiles.status === "RESOLVED" ? "Resolved" : "Ongoing";
      
      const submissionData = {
        ...dataWithoutFiles,
        status: dbStatus,
        referredToGCO: dataWithoutFiles.referredToGCO ? "Yes" : "No",
        caseNo: record.caseNo // Include the case number for update
      };
      
      const response = await fetch(`http://localhost:5000/api/case-records/${record.caseNo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Notify parent component that the record was updated
        if (onRecordUpdated) {
          onRecordUpdated();
        }
        
        // Close the overlay without showing any alert
        onClose();
      } else {
        // Only show error alert if something went wrong
        alert("Error updating case record: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating the case record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !record) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        {/* Back button */}
        <button className="back-btn" onClick={onClose}>
          ← Back
        </button>
        <h2>Edit Record</h2>

        <form onSubmit={handleSubmit}>
          {/* Student Information and Details */}
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
              <h4>Details</h4>
              <div className="form-grid">
                <label>Level of Violation</label>
                <select 
                  name="violationLevel"
                  value={formData.violationLevel} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="Minor Offense">Minor Offense</option>
                  <option value="Major Offense">Major Offense</option>
                  <option value="Serious Offense">Serious Offense</option>
                </select>
                <label>Status</label>
                <select 
                  name="status"
                  value={formData.status} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="ON GOING">ON GOING</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>
            </div>
          </div>

          {/* General Description */}
          <div className="box">
            <h4>General Description</h4>
            <textarea
              name="description"
              rows="4"
              maxLength="500"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            <div className="char-limit">Max 500 characters</div>
          </div>

          {/* Additional Remarks */}
          <div className="box">
            <label>Additional Remarks</label>
            <textarea
              name="remarks"
              rows="2"
              maxLength="500"
              value={formData.remarks}
              onChange={handleInputChange}
            />
            <div className="char-limit">Max 500 characters</div>
            <div className="checkbox">
              <input 
                type="checkbox" 
                id="referGCO" 
                name="referredToGCO"
                checked={formData.referredToGCO}
                onChange={handleInputChange}
              />
              <label htmlFor="referGCO">Refer to GCO</label>
            </div>
          </div>

          {/* Upload files */}
          <div className="box">
            <h4>Upload files</h4>
            <div className="file-upload">
              <input
                type="file"
                id="fileInput"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept=".png,.pdf,.docx"
              />
              <label htmlFor="fileInput">
                <p>Drop your files here <br /> or <span>Browse</span></p>
              </label>
            </div>
            <small>Files must be .png, .pdf, or .docx and not exceed more than 5MB</small>
            
            {formData.files.length > 0 && (
              <div>
                <h5>Selected files:</h5>
                <ul>
                  {formData.files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Save button */}
          <div className="actions">
            <button 
              type="submit" 
              className="save-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "UPDATING..." : "UPDATE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCase;