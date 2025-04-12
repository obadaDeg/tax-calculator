
import React from "react";

const TaxResult = ({ calculatedTax, grossAmount }) => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Tax Calculation Result</h3>
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Gross Amount:</span>
          <span className="font-medium">PKR {grossAmount.toLocaleString()}</span>
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
          <span className="text-lg font-bold text-green-700">
            PKR {calculatedTax.netAmount.toLocaleString()}
          </span>
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
  );
};

export default TaxResult;
