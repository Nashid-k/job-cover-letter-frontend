import React from "react";
import { useAuth } from "../features/auth/AuthContext";
import { User, LogOut } from "lucide-react";

export default function Dashboard() {
  const { user, logoutUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Here's your account details
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Name
              </label>
              <p className="text-lg text-gray-900 dark:text-white">
                {user?.name}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Email
              </label>
              <p className="text-lg text-gray-900 dark:text-white">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={logoutUser}
            className="inline-flex items-center px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition"
          >
            <LogOut className="w-5 h-5 mr-2" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
