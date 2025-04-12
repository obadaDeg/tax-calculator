
import { useState } from "react";
import axios from "axios";

// Base URL for API requests
const API_BASE_URL = "http://localhost:5000";

/**
 * Custom hook for handling tax calculations
 * 
 * @returns {Object} Calculation state and calculate function
 */
export const useCalculateTax = () => {
  const [calculatedTax, setCalculatedTax] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Calculate tax based on provided data
   * 
   * @param {Object} data - Tax calculation parameters
   * @param {string} data.subCategoryId - Selected subcategory ID
   * @param {string} data.filerStatus - Filer status ('filer' or 'non-filer')
   * @param {number} data.grossAmount - Gross amount for calculation
   */
  const calculateTax = async (data) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_BASE_URL}/api/calculate-tax`, data);
      setCalculatedTax(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to calculate tax");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    calculatedTax,
    calculateTax,
    loading,
    error
  };
};