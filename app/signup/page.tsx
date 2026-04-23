"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Shield, Users } from "lucide-react";
import { signupUser } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [role, setRole] = useState("HR");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await signupUser({
        email: email.trim(),
        password: password.trim(),
        role,
      });

      router.push("/");
    } catch (error: any) {
      setError(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/20 blur-[120px] rounded-full" />

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500 text-white flex items-center justify-center text-2xl font-bold shadow-xl mb-4">
            O
          </div>

          <h1 className="text-3xl font-bold text-white">Create Account</h1>

          <p className="text-gray-300 mt-2">Join OptiAsset System</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-4">
            <User size={18} className="text-gray-300" />
            <input
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent p-3 outline-none text-white placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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
                <Users size={18} />
                Employee
              </div>
            </button>
          </div>

          <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-4">
            <Mail size={18} className="text-gray-300" />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent p-3 outline-none text-white placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-4">
            <Lock size={18} className="text-gray-300" />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent p-3 outline-none text-white placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-4">
            <Lock size={18} className="text-gray-300" />
            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-transparent p-3 outline-none text-white placeholder-gray-400"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-2xl font-semibold transition shadow-lg"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/")}
            className="text-cyan-400 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}