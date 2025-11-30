// src/hooks/useStudentAutocomplete.js
import { useState } from 'react';

const useStudentAutocomplete = () => {
  const [studentSuggestions, setStudentSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStudentSuggestions = async (query) => {
    if (query.length < 3) {
      setStudentSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/students/search?id=${query}`);
      const data = await response.json();
      
      if (data.success) {
        setStudentSuggestions(data.students);
        setShowSuggestions(data.students.length > 0);
      } else {
        setStudentSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching student suggestions:", error);
      setStudentSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSuggestions = () => {
    setStudentSuggestions([]);
    setShowSuggestions(false);
  };

  return {
    studentSuggestions,
    showSuggestions,
    isLoading,
    fetchStudentSuggestions,
    clearSuggestions
  };
};

export default useStudentAutocomplete;