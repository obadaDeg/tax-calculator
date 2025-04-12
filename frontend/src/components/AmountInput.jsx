import React from "react";

const AmountInput = ({ label, value, onChange, prefix }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{prefix}</span>
        </div>
        <input
          type="number"
          value={value}
          onChange={onChange}
          placeholder="0.00"
          className="w-full pl-14 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          aria-label={label}
        />
      </div>
    </div>
  );
};

export default AmountInput;
