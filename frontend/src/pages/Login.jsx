import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login/", { email, password });
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bg-purple-500 rounded-full -top-40 -right-40 w-80 h-80 mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bg-blue-500 rounded-full -bottom-40 -left-40 w-80 h-80 mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="p-8 border shadow-2xl bg-white/10 backdrop-blur-md border-white/20 rounded-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-400" style={{ fontFamily: "'Poppins', sans-serif" }}>
              TaskApp
            </h1>
            <p className="text-sm text-gray-300" style={{ fontFamily: "'Inter', sans-serif" }}>Welcome back to productivity</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 mb-6 text-sm text-red-200 border rounded-lg bg-red-500/20 border-red-500/50">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300" style={{ fontFamily: "'Inter', sans-serif" }}>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-3 text-white placeholder-gray-400 transition border bg-white/5 border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white/10"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300" style={{ fontFamily: "'Inter', sans-serif" }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-3 text-white placeholder-gray-400 transition border bg-white/5 border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white/10"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-3 font-bold text-white transition transform bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-purple-400 transition hover:text-purple-300">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-xs text-center text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>
          © 2026 TaskApp. All rights reserved.
        </p>
      </div>
    </div>
  );
}