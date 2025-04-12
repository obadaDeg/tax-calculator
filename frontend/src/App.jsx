import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [subSections, setSubSections] = useState([]);
  const [selectedSubSection, setSelectedSubSection] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [filerStatus, setFilerStatus] = useState("filer");
  const [grossAmount, setGrossAmount] = useState("");
  const [calculatedTax, setCalculatedTax] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get("https://localhost:5000/api/tax-sections");
        console.log("[DEBUG] Fetched tax sections:", response.data);
        if (!Array.isArray(response.data)) {
          // throw new Error("Invalid data format");
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
    if (!selectedSection) return;

    const fetchSubSections = async () => {
      try {
        const response = await axios.get(
          `https://localhost:5000/api/tax-subsections/${selectedSection}`
        );
        setSubSections(response.data);
        setSelectedSubSection("");
        setCategories([]);
        setSelectedCategory("");
        setSubCategories([]);
        setSelectedSubCategory("");
      } catch (err) {
        setError("Failed to fetch subsections");
        console.error(err);
      }
    };

    fetchSubSections();
  }, [selectedSection]);

  // Fetch categories when a subsection is selected
  useEffect(() => {
    if (!selectedSubSection) return;

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `https://localhost:5000/api/tax-categories/${selectedSubSection}`
        );
        setCategories(response.data);
        setSelectedCategory("");
        setSubCategories([]);
        setSelectedSubCategory("");
      } catch (err) {
        setError("Failed to fetch categories");
        console.error(err);
      }
    };

    fetchCategories();
  }, [selectedSubSection]);

  // Fetch subcategories when a category is selected
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchSubCategories = async () => {
      try {
        const response = await axios.get(
          `https://localhost:5000/api/tax-subcategories/${selectedCategory}`
        );
        setSubCategories(response.data);
        setSelectedSubCategory("");
      } catch (err) {
        setError("Failed to fetch subcategories");
        console.error(err);
      }
    };

    fetchSubCategories();
  }, [selectedCategory]);

  const handleCalculate = async () => {
    if (!selectedSubCategory || !grossAmount) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("https://localhost:5000/api/calculate-tax", {
        subCategoryId: selectedSubCategory,
        filerStatus,
        grossAmount: parseFloat(grossAmount),
      });

      setCalculatedTax(response.data);
    } catch (err) {
      setError("Failed to calculate tax");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Pakistan Tax Calculator - Tax Year 2025</h1>
      </header>

      <div className="calculator-container">
        <h2>Calculate Tax</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Select Tax Section</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <option value="">-- Select Tax Section --</option>
            {Array.isArray(sections) ? (
              sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))
            ) : (
              <option disabled>Loading or failed to load sections</option>
            )}
          </select>
        </div>

        {selectedSection && (
          <div className="form-group">
            <label>Select Sub-section</label>
            <select
              value={selectedSubSection}
              onChange={(e) => setSelectedSubSection(e.target.value)}
            >
              <option value="">-- Select Sub-section --</option>
              {subSections.map((subSection) => (
                <option key={subSection.id} value={subSection.id}>
                  {subSection.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedSubSection && (
          <div className="form-group">
            <label>Select Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">-- Select Category --</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedCategory && (
          <div className="form-group">
            <label>Select Sub-Category</label>
            <select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
            >
              <option value="">-- Select Sub-Category --</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory.id} value={subCategory.id}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group filer-status">
          <label>Filer Status:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="filerStatus"
                value="filer"
                checked={filerStatus === "filer"}
                onChange={() => setFilerStatus("filer")}
              />
              Filer
            </label>
            <label>
              <input
                type="radio"
                name="filerStatus"
                value="non-filer"
                checked={filerStatus === "non-filer"}
                onChange={() => setFilerStatus("non-filer")}
              />
              Non-Filer
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Gross Amount (PKR)</label>
          <input
            type="number"
            value={grossAmount}
            onChange={(e) => setGrossAmount(e.target.value)}
            placeholder="Enter amount in PKR"
          />
        </div>

        <button
          className="calculate-btn"
          onClick={handleCalculate}
          disabled={loading}
        >
          {loading ? "Calculating..." : "Calculate Tax"}
        </button>

        {calculatedTax && (
          <div className="result-section">
            <h3>Tax Calculation Result</h3>
            <div className="result-row">
              <span>Gross Amount:</span>
              <span>PKR {parseFloat(grossAmount).toLocaleString()}</span>
            </div>
            <div className="result-row">
              <span>Tax Rate:</span>
              <span>{calculatedTax.taxRate}%</span>
            </div>
            <div className="result-row">
              <span>Tax Amount:</span>
              <span>PKR {calculatedTax.taxAmount.toLocaleString()}</span>
            </div>
            <div className="result-row highlight">
              <span>Net Amount:</span>
              <span>PKR {calculatedTax.netAmount.toLocaleString()}</span>
            </div>
            <div className="tax-note">
              <span>Tax Nature:</span>
              <span>{calculatedTax.taxNature}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
