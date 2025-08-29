import React from "react";
import { useAuth } from "../features/auth/AuthContext";
import { User, LogOut } from "lucide-react";

export default function Dashboard() {
  const { user, logoutUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-md mb-4 transform hover:scale-105 transition-transform">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Here's your account overview
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <User className="w-5 h-5 mr-2 text-indigo-500" />
            Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Name
              </label>
              <p className="text-base text-gray-900 dark:text-white">
                {user?.name || "Not provided"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Email
              </label>
              <p className="text-base text-gray-900 dark:text-white">
                {user?.email || "No email"}
              </p>
            </div>
          </div>
          <button
            onClick={logoutUser}
            className="inline-flex items-center px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}