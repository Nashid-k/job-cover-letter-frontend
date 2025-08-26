import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { Menu, X, Sun, Moon, LogOut } from "lucide-react";
// import { useTheme } from "../context/ThemeContext"; // Import your theme context
import { useTheme } from "../features/theme/ThemeContext";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <Link 
            to="/dashboard" 
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
          >
            MyApp
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-all duration-300 font-medium transform hover:scale-105 ${
                  isActive 
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-lg" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-all duration-300 font-medium transform hover:scale-105 ${
                  isActive 
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-lg" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                }`
              }
            >
              Profile
            </NavLink>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <Sun size={20} className="text-yellow-500 animate-pulse" />
              ) : (
                <Moon size={20} className="text-gray-600 dark:text-gray-400" />
              )}
            </button>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Hello, <span className="text-blue-600 dark:text-blue-400 font-semibold">{user.name}</span>
              </span>
              <button
                onClick={logoutUser}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-red-500/25"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            >
              {isDarkMode ? (
                <Sun size={20} className="text-yellow-500" />
              ) : (
                <Moon size={20} className="text-gray-600" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 text-gray-700 dark:text-gray-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-5 duration-300">
          <div className="px-4 py-6 space-y-4">
            <NavLink
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium"
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium"
            >
              Profile
            </NavLink>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                Hello, <span className="text-blue-600 dark:text-blue-400 font-semibold">{user.name}</span>
              </p>
              <button
                onClick={() => {
                  logoutUser();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 font-medium flex items-center space-x-2"
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