import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/signup", { email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-linear-to-br from-orange-900 via-pink-900 to-orange-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bg-pink-500 rounded-full -top-40 -left-40 w-80 h-80 mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bg-orange-500 rounded-full -bottom-40 -right-40 w-80 h-80 mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="p-8 border shadow-2xl bg-white/10 backdrop-blur-md border-white/20 rounded-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-pink-300 to-orange-300" style={{ fontFamily: "'Playfair Display', serif" }}>
              Join Us
            </h1>
            <p className="text-sm text-gray-300" style={{ fontFamily: "'Lato', sans-serif" }}>Create your account and start organizing</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 mb-6 text-sm text-red-200 border rounded-lg bg-red-500/20 border-red-500/50">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300" style={{ fontFamily: "'Lato', sans-serif" }}>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-3 text-white placeholder-gray-400 transition border bg-white/5 border-white/10 rounded-xl focus:outline-none focus:border-pink-500 focus:bg-white/10"
                style={{ fontFamily: "'Lato', sans-serif" }}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300" style={{ fontFamily: "'Lato', sans-serif" }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-3 text-white placeholder-gray-400 transition border bg-white/5 border-white/10 rounded-xl focus:outline-none focus:border-pink-500 focus:bg-white/10"
                style={{ fontFamily: "'Lato', sans-serif" }}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300" style={{ fontFamily: "'Lato', sans-serif" }}>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-5 py-3 text-white placeholder-gray-400 transition border bg-white/5 border-white/10 rounded-xl focus:outline-none focus:border-pink-500 focus:bg-white/10"
                style={{ fontFamily: "'Lato', sans-serif" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-3 font-bold text-white transition transform bg-linear-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 rounded-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }}>
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-pink-400 transition hover:text-pink-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-xs text-center text-gray-500" style={{ fontFamily: "'Lato', sans-serif" }}>
          © 2026 TaskApp. All rights reserved.
        </p>
      </div>
    </div>
  );
}