import { useState, useEffect } from "react";
import axios from "axios";

// Base URL for API requests
const API_BASE_URL = "http://localhost:5000";

/**
 * Custom hook to fetch and manage tax data from the API
 * 
 * @param {string} sectionId - The selected tax section ID
 * @param {string} subSectionId - The selected tax sub-section ID
 * @param {string} categoryId - The selected tax category ID
 * @returns {Object} Tax data and loading/error states
 */
export const useTaxData = (sectionId, subSectionId, categoryId) => {
  const [sections, setSections] = useState([]);
  const [subSections, setSubSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [error, setError] = useState("");

  // Fetch tax sections on hook initialization
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tax-sections`);
        if (!Array.isArray(response.data)) {
          throw new Error("Invalid data format");
        }
        setSections(response.data);
      } catch (err) {
        setError("Failed to fetch tax sections");
        console.error(err);
      }
    };

    fetchSections();
  }, []);

  // Fetch subsections when a section is selected
  useEffect(() => {
    if (!sectionId) return;

    const fetchSubSections = async () => {
      try {
        setError("");
        const response = await axios.get(
          `${API_BASE_URL}/api/tax-subsections/${sectionId}`
        );
        setSubSections(response.data);
      } catch (err) {
        setError("Failed to fetch subsections");
        console.error(err);
      }
    };

    fetchSubSections();
  }, [sectionId]);

  // Fetch categories when a subsection is selected
  useEffect(() => {
    if (!subSectionId) return;

    const fetchCategories = async () => {
      try {
        setError("");
        const response = await axios.get(
          `${API_BASE_URL}/api/tax-categories/${subSectionId}`
        );
        setCategories(response.data);
      } catch (err) {
        setError("Failed to fetch categories");
        console.error(err);
      }
    };

    fetchCategories();
  }, [subSectionId]);

  // Fetch subcategories when a category is selected
  useEffect(() => {
    if (!categoryId) return;

    const fetchSubCategories = async () => {
      try {
        setError("");
        const response = await axios.get(
          `${API_BASE_URL}/api/tax-subcategories/${categoryId}`
        );
        setSubCategories(response.data);
      } catch (err) {
        setError("Failed to fetch subcategories");
        console.error(err);
      }
    };

    fetchSubCategories();
  }, [categoryId]);

  return {
    sections,
    subSections,
    categories,
    subCategories,
    error
  };
};
