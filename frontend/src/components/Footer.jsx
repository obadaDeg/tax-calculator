
import React from "react";

const Footer = () => {
  return (
    <footer className="mt-12 py-6 bg-gray-100 text-center text-gray-600 text-sm">
      <div className="container mx-auto px-4">
        <p>© {new Date().getFullYear()} Pakistan Tax Calculator. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
