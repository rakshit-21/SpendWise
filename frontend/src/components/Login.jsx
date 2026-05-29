import React, { useState } from "react";
import axios from "axios";
import { Wallet, Mail, Lock, Eye, EyeOff, User } from "lucide-react";

const API = "https://spendwise-90v0.onrender.com/api/auth";

function Login({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isSignUp ? "/register" : "/login";
      const payload = isSignUp
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password };

      const res = await axios.post(`${API}${endpoint}`, payload);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      onLogin(res.data.user);

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <Wallet className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            SpendWise
          </h1>
          <p className="text-gray-600">
            {isSignUp ? "Create your account to get started" : "Welcome back! Please login to your account"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name (Sign Up only) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder={isSignUp ? "Min. 6 characters" : "Enter your password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? <EyeOff className="text-gray-400 w-5 h-5" /> : <Eye className="text-gray-400 w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot (Login only) */}
            {!isSignUp && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  Remember me
                </label>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:scale-[1.02] transition disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  {isSignUp ? "Creating Account..." : "Signing In..."}
                </span>
              ) : (
                isSignUp ? "Create Account" : "Sign In"
              )}
            </button>

          </form>

          {/* Divider */}
          {!isSignUp && (
            <>
              <div className="mt-6 text-center text-gray-500 text-sm">Or continue with</div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <button className="border border-gray-200 p-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                  Google
                </button>
                <button className="border border-gray-200 p-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                  Facebook
                </button>
              </div>
            </>
          )}

        </div>

        {/* Toggle Sign Up / Login */}
        <p className="text-center mt-6 text-sm text-gray-600">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(""); setForm({ name: "", email: "", password: "" }); }}
            className="text-indigo-600 font-medium hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign up for free"}
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;