// src/components/forms/GCOForm.js
import React, { useRef, useState, useEffect } from 'react';
import StudentAutocomplete from '../common/StudentAutocomplete';
import './FormStyles.css';

const GCOForm = ({
  formData,
  onInputChange,
  onStudentIdChange,
  onStudentSelect,
  studentSuggestions,
  showSuggestions,
  isLoading,
  primaryColor,
  onFilesSelected,
  selectedFiles,
  existingFiles = [],
  onRemoveExistingFile,
  onRemoveNewFile,
  onFileClassifications,
  isEditMode = false,
  isDisabled = false
}) => {
  const fileInputRef = useRef(null);
  const [fileClassifications, setFileClassifications] = useState({});
  const [maxFilesError, setMaxFilesError] = useState('');

  // Calculate remaining file slots
  const totalCurrentFiles = (isEditMode ? existingFiles.length : 0) + selectedFiles.length;
  const remainingSlots = 5 - totalCurrentFiles;

  // Pass file classifications to parent component when they change
  useEffect(() => {
    if (onFileClassifications) {
      const classifications = Object.values(fileClassifications).filter(classification => 
        classification && classification.filename
      );
      onFileClassifications(classifications);
    }
  }, [fileClassifications, onFileClassifications]);

  // Validate max files
  useEffect(() => {
    if (totalCurrentFiles > 5) {
      setMaxFilesError(`Maximum 5 files allowed. You have ${totalCurrentFiles} files.`);
    } else {
      setMaxFilesError('');
    }
  }, [totalCurrentFiles]);

  const handleAttachmentClick = () => {
    if (isDisabled || remainingSlots <= 0) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (isDisabled) return;
    
    const files = Array.from(e.target.files);

    // Filter only PDF and DOCX files
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    const validFiles = files.filter(file => allowedTypes.includes(file.type));

    if (validFiles.length !== files.length) {
      alert('Only PDF and DOCX files are allowed. Other file types have been removed.');
    }

    // Check if adding these files would exceed the limit
    const totalAfterAdd = totalCurrentFiles + validFiles.length;
    if (totalAfterAdd > 5) {
      alert(`Maximum 5 files allowed. You currently have ${totalCurrentFiles} files and tried to add ${validFiles.length} more. Please remove some files first.`);
      return;
    }

    if (validFiles.length > 0) {
      // Initialize classifications for new files (for consistency with INF form)
      const newClassifications = {};
      validFiles.forEach(file => {
        newClassifications[file.name] = {
          filename: file.name,
          // GCO files don't need medical/psychological classification
        };
      });
      
      setFileClassifications(prev => ({
        ...prev,
        ...newClassifications
      }));
      
      onFilesSelected([...selectedFiles, ...validFiles]);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveNewFile = (index) => {
    if (isDisabled) return;
    
    const fileToRemove = selectedFiles[index];
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    
    // Remove classification for deleted file
    setFileClassifications(prev => {
      const newClassifications = { ...prev };
      delete newClassifications[fileToRemove.name];
      return newClassifications;
    });
    
    onFilesSelected(newFiles);
  };

  const handleInputChange = (e) => {
    if (isDisabled) return;
    
    const { name, value } = e.target;

    // If status is changing to "To Schedule", reset date and time
    if (name === 'status' && value === 'To Schedule') {
      // First update the status
      onInputChange(e);

      // Clear date and time fields
      onInputChange({
        target: {
          name: 'date',
          value: ''
        }
      });

      onInputChange({
        target: {
          name: 'time',
          value: ''
        }
      });
    } else {
      onInputChange(e);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    return '📎';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  // Check if date and time should be required based on status
  const isDateRequired = formData.status !== 'To Schedule';
  const isTimeRequired = formData.status !== 'To Schedule';

  return (
    <div className="form-container">
      <div className="form-sections-row">
        <div className="form-section">
          <h4 style={{ color: primaryColor }}>Student Information</h4>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="idNumber">ID Number *</label>
              <StudentAutocomplete
                value={formData.studentId}
                onChange={onStudentIdChange}
                onStudentSelect={onStudentSelect}
                studentSuggestions={studentSuggestions}
                showSuggestions={showSuggestions}
                isLoading={isLoading}
                placeholder="Enter ID Number"
                required={true}
                disabled={isDisabled || isEditMode}
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                disabled={true}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="strand">Strand</label>
              <input
                type="text"
                id="strand"
                name="strand"
                value={formData.strand}
                onChange={handleInputChange}
                disabled={true}
              />
            </div>
            <div className="form-group">
              <label htmlFor="gradeLevel">Grade Level</label>
              <input
                type="text"
                id="gradeLevel"
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleInputChange}
                disabled={true}
              />
            </div>
            <div className="form-group">
              <label htmlFor="section">Section</label>
              <input
                type="text"
                id="section"
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                disabled={true}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="schoolYearSemester">School Year & Semester</label>
              <input
                type="text"
                id="schoolYearSemester"
                name="schoolYearSemester"
                value={formData.schoolYearSemester || formData.schoolYear || ''}
                onChange={handleInputChange}
                disabled={true}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4 style={{ color: primaryColor }}>Schedule *</h4>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sessionNumber">Session Number *</label>
              <input
                type="text"
                id="sessionNumber"
                name="sessionNumber"
                value={formData.sessionNumber}
                onChange={handleInputChange}
                placeholder="e.g., Session 1"
                required
                disabled={isDisabled}
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                disabled={isDisabled}
              >
                <option value="">-</option>
                <option value="Scheduled">Scheduled</option>
                <option value="To Schedule">To Schedule</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date {isDateRequired ? '*' : ''}</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required={isDateRequired}
                disabled={isDisabled || formData.status === 'To Schedule'}
              />
            </div>
            <div className="form-group">
              <label htmlFor="time">Time {isTimeRequired ? '*' : ''}</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required={isTimeRequired}
                disabled={isDisabled || formData.status === 'To Schedule'}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="psychologicalCondition">Is Psychological? *</label>
            <select
              id="psychologicalCondition"
              name="psychologicalCondition"
              value={formData.psychologicalCondition}
              onChange={handleInputChange}
              required
              disabled={isDisabled}
            >
              <option value="NO">No</option>
              <option value="YES">Yes</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section-full">
        <h4 style={{ color: primaryColor }}>Concern *</h4>
        <div className="form-group">
          <label htmlFor="generalConcern">General Concern *</label>
          <textarea
            id="generalConcern"
            name="generalConcern"
            value={formData.generalConcern}
            onChange={handleInputChange}
            rows="4"
            placeholder="Enter detailed description of the concern..."
            required
            disabled={isDisabled}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="additionalRemarks">Additional Remarks</label>
          <textarea
            id="additionalRemarks"
            name="additionalRemarks"
            value={formData.additionalRemarks}
            onChange={handleInputChange}
            rows="2"
            placeholder="Enter any additional remarks..."
            disabled={isDisabled}
          ></textarea>
        </div>
      </div>

      <div className="form-section-full">
        <h4 style={{ color: primaryColor }}>Attachments</h4>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept=".pdf,.doc,.docx"
          disabled={isDisabled}
        />

        {/* File upload info */}
        <div className="file-upload-info">
          <p><strong>Maximum 5 files allowed</strong> (PDF, DOC, DOCX only, 10MB each)</p>
          <p>Remaining file slots: <strong>{remainingSlots}</strong></p>
        </div>

        {maxFilesError && (
          <div className="max-files-notice" style={{color: '#e74c3c', marginBottom: '10px'}}>
            <small>{maxFilesError}</small>
          </div>
        )}

        {/* Existing files in edit mode */}
        {isEditMode && existingFiles.length > 0 && (
          <div className="existing-files">
            <h5>Current Files:</h5>
            {existingFiles.map((file, index) => (
              <div key={index} className="file-item existing">
                <span className="file-icon">
                  {getFileIcon(file.mimetype || file.type)}
                </span>
                <span className="file-name">{file.originalname || file.name}</span>
                <span className="file-size">
                  ({formatFileSize(file.size)})
                </span>
                {!isDisabled && (
                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={() => onRemoveExistingFile(file.filename)}
                    title="Remove file"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {remainingSlots > 0 && !isDisabled && (
          <div
            className="attachment-box"
            style={{ borderColor: primaryColor }}
            onClick={handleAttachmentClick}
          >
            <div className="attachment-content">
              <p>Click to browse files</p>
              <small>Supported formats: PDF, DOC, DOCX (Max 5 files total, 10MB each)</small>
              <small>Remaining slots: {remainingSlots}</small>
            </div>
          </div>
        )}

        {/* Selected new files */}
        {selectedFiles.length > 0 && (
          <div className="selected-files">
            <h5>New Files to Upload:</h5>
            {selectedFiles.map((file, index) => (
              <div key={index} className="file-item new">
                <div className="file-info">
                  <span className="file-icon">
                    {getFileIcon(file.type)}
                  </span>
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">
                    ({formatFileSize(file.size)})
                  </span>
                </div>
                {!isDisabled && (
                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={() => handleRemoveNewFile(index)}
                    title="Remove file"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Show message when adding files in edit mode */}
        {isEditMode && existingFiles.length > 0 && selectedFiles.length > 0 && (
          <div className="file-replace-notice">
            <small>New files will be added to the current files</small>
          </div>
        )}

        {/* Show message when maximum files reached */}
        {remainingSlots <= 0 && (
          <div className="max-files-notice">
            <small style={{color: '#e74c3c'}}>Maximum file limit reached (5 files). Remove some files to add new ones.</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default GCOForm;