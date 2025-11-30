// utils/recordTypeDetector.js
export const detectRecordType = (record) => {
  if (!record) return null;
  
  // Check for INF/Medical record indicators
  if (record.mr_medical_id || record.recordId && (record.mr_student_id || record.medicalDetails)) {
    return "INF";
  }
  
  // Check for GCO/Counseling record indicators
  if (record.cor_record_id || record.recordId && (record.sessionNumber || record.cor_session_number)) {
    return "GCO";
  }
  
  // Check for OPD/Case record indicators
  if (record.cr_case_id || record.caseNo || record.violationLevel) {
    return "OPD";
  }
  
  return null;
};