import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { Menu, X, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const navLinkStyle = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
      isActive 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25" 
        : "text-white hover:bg-gray-800 opacity-90 hover:opacity-100"
    }`;

  return (
    <nav style={{ 
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgb(55, 65, 81)',
      transition: 'all 0.3s ease'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/dashboard" 
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-purple-400 hover:to-blue-400 transition-all duration-300"
          >
            MyApp
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/dashboard" className={navLinkStyle}>
              Dashboard
            </NavLink>
            <NavLink to="/profile" className={navLinkStyle}>
              Profile
            </NavLink>
            <NavLink to="/coverletter" className={navLinkStyle}>
              Cover Letter
            </NavLink>
          </div>

          {/* Desktop Right Side - FIXED: Items now side by side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* User Info */}
            <div className="flex items-center">
              <span className="text-white text-sm">
                Hello, <span className="font-semibold">{user.name}</span>
              </span>
            </div>

            <button
              onClick={logoutUser}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-all duration-300"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div 
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'rgba(17, 24, 39, 0.98)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgb(55, 65, 81)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
          }}
          className="md:hidden"
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-2 mb-4">
              <NavLink
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg" 
                      : "text-white hover:bg-gray-800 opacity-90 hover:opacity-100"
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/profile"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg" 
                      : "text-white hover:bg-gray-800 opacity-90 hover:opacity-100"
                  }`
                }
              >
                Profile
              </NavLink>
              <NavLink
                to="/coverletter"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg" 
                      : "text-white hover:bg-gray-800 opacity-90 hover:opacity-100"
                  }`
                }
              >
                Cover Letter
              </NavLink>
            </div>

            {/* Mobile User Info */}
            <div className="pt-4 border-t border-gray-700">
              <div className="px-4 py-2">
                <p className="text-white">
                  Hello, <span className="font-semibold">{user.name}</span>
                </p>
                <p className="text-white text-sm mt-1 opacity-80">
                  {user.email}
                </p>
              </div>

              <button
                onClick={() => {
                  logoutUser();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-300 mt-2"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}