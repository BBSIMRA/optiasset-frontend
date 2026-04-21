"use client";

import { useEffect, useState } from "react";
import {
  Laptop,
  Package,
  CalendarDays,
  ShieldCheck,
  Moon,
  Sun,
  User,
  LogOut,
} from "lucide-react";

import { logoutUser } from "@/lib/api";

export default function MyAssetsPage() {
  const [dark, setDark] = useState(true);
  const [user, setUser] = useState<any>({
    name: "Employee",
    role: "EMPLOYEE",
  });

  /* Demo assets (replace with API later) */
  const [assets] = useState<any[]>([
    {
      asset_tag: "LAP-1021",
      asset_name: "Dell Latitude Laptop",
      status: "Assigned",
      assigned_date: "2026-04-10",
    },
    {
      asset_tag: "MON-3401",
      asset_name: "Samsung Monitor",
      status: "Assigned",
      assigned_date: "2026-04-12",
    },
    {
      asset_tag: "MOU-9011",
      asset_name: "Wireless Mouse",
      status: "Assigned",
      assigned_date: "2026-04-12",
    },
  ]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setDark(savedTheme !== "light");

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  async function handleLogout() {
    await logoutUser();
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        dark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-white"
          : "bg-gradient-to-br from-cyan-100 via-white to-blue-100 text-black"
      }`}
    >
      <div className="p-4 md:p-6">

        {/* Top Navbar */}
        <div
          className={`rounded-3xl border backdrop-blur-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
            dark
              ? "bg-white/10 border-white/10"
              : "bg-white/70 border-white"
          }`}
        >
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {user.name}
            </h1>

            <p
              className={`mt-1 ${
                dark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              My Assigned Assets
            </p>
          </div>

          <div className="flex gap-3">

            <button
              onClick={() => {
                setDark(!dark);
                localStorage.setItem(
                  "theme",
                  dark ? "light" : "dark"
                );
              }}
              className={`p-3 rounded-2xl border ${
                dark
                  ? "bg-white/10 border-white/10"
                  : "bg-white border-gray-300"
              }`}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={handleLogout}
              className="px-5 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>
        </div>

        {/* Profile Card */}
        <div className="grid md:grid-cols-4 gap-5 mb-8">

          <GlassCard dark={dark}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500 text-white">
                <User size={20} />
              </div>

              <div>
                <p className="text-sm opacity-70">
                  Employee Name
                </p>

                <h2 className="font-bold text-lg">
                  {user.name}
                </h2>
              </div>
            </div>
          </GlassCard>

          <GlassCard dark={dark}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-green-500 text-white">
                <Package size={20} />
              </div>

              <div>
                <p className="text-sm opacity-70">
                  Total Assets
                </p>

                <h2 className="font-bold text-lg">
                  {assets.length}
                </h2>
              </div>
            </div>
          </GlassCard>

          <GlassCard dark={dark}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-yellow-500 text-white">
                <ShieldCheck size={20} />
              </div>

              <div>
                <p className="text-sm opacity-70">
                  Status
                </p>

                <h2 className="font-bold text-lg">
                  Active
                </h2>
              </div>
            </div>
          </GlassCard>

          <GlassCard dark={dark}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-500 text-white">
                <CalendarDays size={20} />
              </div>

              <div>
                <p className="text-sm opacity-70">
                  Last Update
                </p>

                <h2 className="font-bold text-lg">
                  Today
                </h2>
              </div>
            </div>
          </GlassCard>

        </div>

        {/* Asset List */}
        <div
          className={`rounded-3xl border backdrop-blur-2xl p-6 ${
            dark
              ? "bg-white/10 border-white/10"
              : "bg-white/70 border-white"
          }`}
        >
          <h2 className="text-2xl font-bold mb-6">
            Assigned Assets
          </h2>

          <div className="grid gap-4">

            {assets.map((item, i) => (
              <div
                key={i}
                className={`rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
                  dark
                    ? "bg-white/5 border border-white/10"
                    : "bg-white border border-gray-200"
                }`}
              >
                <div className="flex items-center gap-4">

                  <div className="p-4 rounded-2xl bg-cyan-500 text-white">
                    <Laptop size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">
                      {item.asset_name}
                    </h3>

                    <p className="text-sm opacity-70">
                      Tag: {item.asset_tag}
                    </p>
                  </div>

                </div>

                <div className="flex gap-4 items-center">

                  <span className="px-4 py-2 rounded-full bg-green-500/20 text-green-500 text-sm font-semibold">
                    {item.status}
                  </span>

                  <span className="text-sm opacity-70">
                    {item.assigned_date}
                  </span>

                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}

function GlassCard({
  children,
  dark,
}: {
  children: React.ReactNode;
  dark: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border backdrop-blur-2xl p-5 ${
        dark
          ? "bg-white/10 border-white/10"
          : "bg-white/70 border-white"
      }`}
    >
      {children}
    </div>
  );
}