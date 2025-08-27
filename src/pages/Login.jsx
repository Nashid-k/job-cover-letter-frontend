/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { login } from "../services/authService";
import { useAuth } from "../features/auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  setSuccess("");
  
  try {
    const res = await login(form);
    if (res.token) {
      setSuccess("Login successful! Redirecting...");
      loginUser(res.user, res.token); 
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } else {
      setError(res.message || "Login failed. Please try again.");
      setTimeout(() => setError(""), 3000);
    }
  } catch (err) {
    setError("An unexpected error occurred. Please try again.");
    setTimeout(() => setError(""), 3000);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 transition-colors">
      <div className="w-full max-w-md">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 transition-colors">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-fadeIn">
              <p className="text-red-600 dark:text-red-400 text-center font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl animate-fadeIn">
              <p className="text-green-600 dark:text-green-400 text-center font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              disabled={loading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;