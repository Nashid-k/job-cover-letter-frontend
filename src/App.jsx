// App.js - Optimized structure with all motion in PageTransition only
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./features/auth/AuthContext";
import { ThemeProvider } from "./features/theme/ThemeContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CoverLetter from "./pages/CoverLetter";
import JobSeekerLanding from "./pages/LandingPage";
import PageTransition from "./components/PageTransition";
import { AnimatePresence } from "framer-motion";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppNavbar() {
  const { user } = useAuth();
  return user ? <Navbar /> : null;
}

function AnimatedRoutes() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            user ? <Navigate to="/dashboard" replace /> : 
            <PageTransition><JobSeekerLanding /></PageTransition>
          } />
          <Route path="/login" element={
            <PageTransition><Login /></PageTransition>
          } />
          <Route path="/register" element={
            <PageTransition><Register /></PageTransition>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <PageTransition><Profile /></PageTransition>
            </PrivateRoute>
          } />
          <Route path="/coverletter" element={
            <PrivateRoute>
              <PageTransition><CoverLetter /></PageTransition>
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <PageTransition><Dashboard /></PageTransition>
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AppNavbar />
          <AnimatedRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}