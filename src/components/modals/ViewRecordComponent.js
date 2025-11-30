// src/components/modals/ViewRecordComponent.js
import React from 'react';
import './AddRecordComponent.css';
import EditButton from '../buttons/EditButton';
import OPDFormView from '../forms/OPDFormView';
import GCOFormView from '../forms/GCOFormView';
import INFFormView from '../forms/INFFormView';
import { detectRecordType } from '../../utils/recordTypeDetector';

const ViewRecordComponent = ({ isOpen, onClose, record, type, onEdit }) => {
    if (!isOpen || !record) return null;

    // Determine the actual record type from the record data
    const recordType = detectRecordType(record);
    const userType = type; // User's department
    
    const getPrimaryColor = () => {
        switch (recordType) {
            case "OPD": return "#003A6C";
            case "GCO": return "#00451D";
            case "INF": return "#640C17";
            default: return "#0a1a3c";
        }
    };

    const getModalTitle = () => {
        switch (recordType) {
            case "OPD":
                return "View Case Record";
            case "GCO":
                return "View Counseling Record";
            case "INF":
                return "View Medical/Psychological Record";
            default:
                return "View Record";
        }
    };

    const handleEditClick = () => {
        onClose();
        onEdit(record);
    };

    const renderFormContent = () => {
        const commonProps = {
            record,
            primaryColor: getPrimaryColor()
        };

        switch (recordType) {
            case "OPD":
                return <OPDFormView {...commonProps} />;
            case "GCO":
                return <GCOFormView {...commonProps} />;
            case "INF":
                return <INFFormView {...commonProps} />;
            default:
                return <p>No form available for this record type</p>;
        }
    };

    // Determine if edit button should be shown based on user type and record type
    const shouldShowEditButton = () => {
        // OPD users can edit OPD records AND INF records
        if (userType === "OPD") {
            return recordType === "OPD" || recordType === "INF";
        }
        
        // GCO users can edit GCO records
        if (userType === "GCO") {
            return recordType === "GCO";
        }
        
        // INF users can only edit INF records
        if (userType === "INF") {
            return recordType === "INF";
        }
        
        return false;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 style={{ color: getPrimaryColor() }}>{getModalTitle()}</h3>
                    <div className="modal-header-right">
                        {shouldShowEditButton() && (
                            <EditButton
                                onClick={handleEditClick}
                                type={recordType}
                                label="Edit Record"
                            />
                        )}
                        <button className="modal-close-btn" onClick={onClose}>
                            ×
                        </button>
                    </div>
                </div>
                <div className="modal-body">
                    {renderFormContent()}
                </div>
                <div className="modal-footer">
                    <button
                        className="btn primary"
                        onClick={onClose}
                        style={{ backgroundColor: getPrimaryColor(), borderColor: getPrimaryColor() }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewRecordComponent;