// components/Layout.js - Clean version without unused imports
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="flex-1 relative min-h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {children}
    </div>
  );
};

export default Layout;