import React from "react";
import { useAuth } from "../features/auth/AuthContext";

export default function Dashboard() {
  const { user, logoutUser } = useAuth();
  return (
    <div className="max-w-xl mx-auto mt-16 p-8 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      <button
        className="mt-4 px-4 py-2 bg-gray-300 rounded"
        onClick={logoutUser}
      >
        Logout
      </button>
    </div>
  );
}