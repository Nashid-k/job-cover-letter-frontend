import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./features/auth/AuthContext";
import { ThemeProvider } from "./features/theme/ThemeContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CoverLetter from "./pages/CoverLetter";
import JobSeekerLanding from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Create a special Navbar that only shows on authenticated routes
function AppNavbar() {
  const { user } = useAuth();
  return user ? <Navbar /> : null;
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AppNavbar />
          <Routes>
            <Route path="/" element={<JobSeekerLanding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/coverletter" 
              element={
                <ProtectedRoute>
                  <CoverLetter />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {/* Catch-all route for unmatched paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}