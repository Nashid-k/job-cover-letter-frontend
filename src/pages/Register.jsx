import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { register } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, CheckCircle, AlertCircle } from "lucide-react";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
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
      const res = await register(form);
      if (res.message === "Account created successfully") {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(res.message || "Registration failed. Please try again.");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setTimeout(() => setError(""), 3000);
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 transition-colors">
      <div className="w-full max-w-md">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 transition-colors">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <UserPlus className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Join us today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-fadeIn">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl animate-fadeIn">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-green-600 dark:text-green-400 font-medium">{success}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              disabled={loading}
            />
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
              placeholder="Create a password"
              required
              disabled={loading}
            />

            <Button
              type="submit"
              loading={loading}
              variant="success"
              className="w-full"
              disabled={loading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;