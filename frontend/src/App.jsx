import React, { useState, useEffect } from "react";
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
        const response = await axios.get("http://localhost:5000/api/tax-sections");
        console.log("[DEBUG] Fetched tax sections:", response.data);
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

  useEffect(() => {
    if (!selectedSection) return;

    const fetchSubSections = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/tax-subsections/${selectedSection}`
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

  useEffect(() => {
    if (!selectedSubSection) return;

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/tax-categories/${selectedSubSection}`
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

  useEffect(() => {
    if (!selectedCategory) return;

    const fetchSubCategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/tax-subcategories/${selectedCategory}`
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
      const response = await axios.post("http://localhost:5000/api/calculate-tax", {
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center">Pakistan Tax Calculator - Tax Year 2025</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Calculate Your Tax</h2>

          {error && (
            <div className="mb-6 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}

          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select Tax Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Select Sub-section</label>
                <select
                  value={selectedSubSection}
                  onChange={(e) => setSelectedSubSection(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Select Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Select Sub-Category</label>
                <select
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
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

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Filer Status</label>
              <div className="flex space-x-6 mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="filerStatus"
                    value="filer"
                    checked={filerStatus === "filer"}
                    onChange={() => setFilerStatus("filer")}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Filer</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="filerStatus"
                    value="non-filer"
                    checked={filerStatus === "non-filer"}
                    onChange={() => setFilerStatus("non-filer")}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Non-Filer</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Gross Amount (PKR)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">PKR</span>
                </div>
                <input
                  type="number"
                  value={grossAmount}
                  onChange={(e) => setGrossAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-14 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleCalculate}
                disabled={loading}
                className={`w-full py-3 px-6 text-white rounded-md shadow-sm font-medium transition-colors duration-200 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                }`}
              >
                {loading ? "Calculating..." : "Calculate Tax"}
              </button>
            </div>
          </div>

          {calculatedTax && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Tax Calculation Result</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gross Amount:</span>
                  <span className="font-medium">PKR {parseFloat(grossAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax Rate:</span>
                  <span className="font-medium">{calculatedTax.taxRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax Amount:</span>
                  <span className="font-medium">PKR {calculatedTax.taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-800">Net Amount:</span>
                  <span className="text-lg font-bold text-green-700">PKR {calculatedTax.netAmount.toLocaleString()}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-600 font-medium">Tax Nature:</span>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mt-1 sm:mt-0">
                      {calculatedTax.taxNature}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-12 py-6 bg-gray-100 text-center text-gray-600 text-sm">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Pakistan Tax Calculator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;