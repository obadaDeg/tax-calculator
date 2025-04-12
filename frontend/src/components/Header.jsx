import React from "react";

const Header = ({ title }) => {
  return (
    <header className="bg-green-700 text-white py-6 shadow-md">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center">{title}</h1>
      </div>
    </header>
  );
};

export default Header;
