/**
 * Pakistan Tax Calculator - Frontend Application
 * 
 * This React application provides a user interface for calculating
 * taxes according to Pakistan's tax regulations.
 * 
 * @author Obada Daghlas
 * @version 1.1.0
 */

import React, { useState } from "react";
import { useTaxData } from "./hooks/useTaxData";
import { useCalculateTax } from "./hooks/useCalculateTax";
import SelectField from "./components/SelectField";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RadioField from "./components/RadioField";
import AmountInput from "./components/AmountInput";
import TaxResult from "./components/TaxResult";
import ErrorMessage from "./components/ErrorMessage";

function App() {
  // Form state
  const [formData, setFormData] = useState({
    sectionId: "",
    subSectionId: "",
    categoryId: "",
    subCategoryId: "",
    filerStatus: "filer",
    grossAmount: "",
  });

  // Get tax data using custom hook
  const {
    sections,
    subSections,
    categories,
    subCategories,
    error: dataError,
  } = useTaxData(formData.sectionId, formData.subSectionId, formData.categoryId);

  // Calculate tax using custom hook
  const {
    calculatedTax,
    calculateTax,
    loading: calculating,
    error: calculationError,
  } = useCalculateTax();

  // Update form field and reset dependent fields
  const handleFieldChange = (field, value) => {
    const updatedFormData = { ...formData, [field]: value };

    // Reset dependent fields
    if (field === "sectionId") {
      updatedFormData.subSectionId = "";
      updatedFormData.categoryId = "";
      updatedFormData.subCategoryId = "";
    } else if (field === "subSectionId") {
      updatedFormData.categoryId = "";
      updatedFormData.subCategoryId = "";
    } else if (field === "categoryId") {
      updatedFormData.subCategoryId = "";
    }

    setFormData(updatedFormData);
  };

  // Handle tax calculation form submission
  const handleCalculate = () => {
    // Validate form inputs
    if (!formData.subCategoryId || !formData.grossAmount) {
      return;
    }

    if (isNaN(formData.grossAmount) || parseFloat(formData.grossAmount) <= 0) {
      return;
    }

    calculateTax({
      subCategoryId: formData.subCategoryId,
      filerStatus: formData.filerStatus,
      grossAmount: parseFloat(formData.grossAmount),
    });
  };

  // Combine errors for display
  const error = dataError || calculationError;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Pakistan Tax Calculator - Tax Year 2025" />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            Calculate Your Tax
          </h2>

          {error && <ErrorMessage message={error} />}

          <div className="grid gap-6">
            {/* Tax Section selection */}
            <SelectField
              label="Select Tax Section"
              value={formData.sectionId}
              onChange={(e) => handleFieldChange("sectionId", e.target.value)}
              options={sections}
              placeholder="-- Select Tax Section --"
            />

            {/* Sub-section selection - only shown when a section is selected */}
            {formData.sectionId && (
              <SelectField
                label="Select Sub-section"
                value={formData.subSectionId}
                onChange={(e) => handleFieldChange("subSectionId", e.target.value)}
                options={subSections}
                placeholder="-- Select Sub-section --"
              />
            )}

            {/* Category selection - only shown when a subsection is selected */}
            {formData.subSectionId && (
              <SelectField
                label="Select Category"
                value={formData.categoryId}
                onChange={(e) => handleFieldChange("categoryId", e.target.value)}
                options={categories}
                placeholder="-- Select Category --"
              />
            )}

            {/* Sub-category selection - only shown when a category is selected */}
            {formData.categoryId && (
              <SelectField
                label="Select Sub-Category"
                value={formData.subCategoryId}
                onChange={(e) => handleFieldChange("subCategoryId", e.target.value)}
                options={subCategories}
                placeholder="-- Select Sub-Category --"
              />
            )}

            {/* Filer status selection */}
            <RadioField
              label="Filer Status"
              name="filerStatus"
              value={formData.filerStatus}
              onChange={(value) => handleFieldChange("filerStatus", value)}
              options={[
                { value: "filer", label: "Filer" },
                { value: "non-filer", label: "Non-Filer" },
              ]}
            />

            {/* Gross amount input */}
            <AmountInput
              label="Gross Amount (PKR)"
              value={formData.grossAmount}
              onChange={(e) => handleFieldChange("grossAmount", e.target.value)}
              prefix="PKR"
            />

            {/* Calculate button */}
            <div className="pt-4">
              <button
                onClick={handleCalculate}
                disabled={calculating}
                className={`w-full py-3 px-6 text-white rounded-md shadow-sm font-medium transition-colors duration-200 ${
                  calculating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                }`}
                aria-label="Calculate Tax"
              >
                {calculating ? "Calculating..." : "Calculate Tax"}
              </button>
            </div>
          </div>

          {/* Results section - only shown after calculation */}
          {calculatedTax && (
            <TaxResult
              calculatedTax={calculatedTax}
              grossAmount={parseFloat(formData.grossAmount)}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;