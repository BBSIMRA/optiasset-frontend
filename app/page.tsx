"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Shield,
  User,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState("HR");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setLoading(true);
    setError("");

    try {
      const payload = {
        email: email.trim(),
        password: password.trim(),
        role: role,
      };

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (Array.isArray(data.detail)) {
          setError(data.detail[0]?.msg || "Login failed");
        } else {
          setError(data.detail || "Login failed");
        }

        setLoading(false);
        return;
      }

      if (data.role === "HR") {
        window.location.assign("/dashboard");
      } else {
        window.location.assign("/employee-dashboard");
      }
    } catch {
      setError("Server error");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Glow Effects */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/20 blur-[120px] rounded-full" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500 text-white flex items-center justify-center text-2xl font-bold shadow-xl mb-4">
            O
          </div>

          <h1 className="text-3xl font-bold text-white">
            OptiAsset
          </h1>

          <p className="text-gray-300 mt-2">
            Sign in to continue
          </p>
        </div>

        {/* Role */}
        <div className="grid grid-cols-2 gap-3 mb-6">

          <button
            type="button"
            onClick={() => setRole("HR")}
            className={`p-3 rounded-2xl font-semibold transition ${
              role === "HR"
                ? "bg-cyan-500 text-white shadow-lg"
                : "bg-white/10 text-gray-300 border border-white/10"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Shield size={18} />
              Admin
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole("EMPLOYEE")}
            className={`p-3 rounded-2xl font-semibold transition ${
              role === "EMPLOYEE"
                ? "bg-cyan-500 text-white shadow-lg"
                : "bg-white/10 text-gray-300 border border-white/10"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <User size={18} />
              Employee
            </div>
          </button>

        </div>

        {/* Inputs */}
        <div className="space-y-4">

          <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-4">
            <Mail size={18} className="text-gray-300" />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-transparent p-3 outline-none text-white placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-4">
            <Lock size={18} className="text-gray-300" />

            <input
              type="password"
              placeholder="Password"
              className="w-full bg-transparent p-3 outline-none text-white placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-2xl font-semibold transition shadow-lg"
          >
            {loading ? "Signing In..." : "Login"}
          </button>

        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-300 mt-6">
          No account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-cyan-400 font-semibold cursor-pointer hover:underline"
          >
            Create one
          </span>
        </p>

      </div>
    </div>
  );
}