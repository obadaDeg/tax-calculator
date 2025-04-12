import React from "react";

const ErrorMessage = ({ message }) => {
  return (
    <div className="mb-6 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
