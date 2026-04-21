"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  AlertTriangle,
  User,
  LogOut,
  Moon,
  Sun,
  Laptop,
  Send,
} from "lucide-react";

import { logoutUser } from "@/lib/api";

export default function EmployeeDashboardPage() {
  const [dark, setDark] = useState(true);

  const [user, setUser] = useState<any>({
    name: "Employee",
    email: "employee@company.com",
    department: "IT",
    code: "EMP001",
  });

  const [myAssets] = useState<any[]>([
    {
      asset_tag: "LAP-1001",
      asset_name: "Dell Latitude Laptop",
      assigned_date: "2026-04-10",
      status: "Assigned",
    },
    {
      asset_tag: "MON-2031",
      asset_name: "Samsung Monitor",
      assigned_date: "2026-04-12",
      status: "Assigned",
    },
  ]);

  const [issue, setIssue] = useState({
    asset: "",
    type: "",
    description: "",
  });

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setDark(theme !== "light");

    const saved = localStorage.getItem("user");

    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  async function handleLogout() {
    await logoutUser();
    localStorage.clear();
    window.location.href = "/";
  }

  function submitIssue() {
    alert("Issue submitted successfully");
    setIssue({
      asset: "",
      type: "",
      description: "",
    });
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        dark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-white"
          : "bg-gradient-to-br from-cyan-100 via-white to-blue-100 text-black"
      }`}
    >
      <div className="flex">

        {/* Sidebar */}
        <div
          className={`w-72 m-4 rounded-3xl p-6 hidden md:block border backdrop-blur-2xl ${
            dark
              ? "bg-white/10 border-white/10"
              : "bg-white/70 border-white"
          }`}
        >
          <h1 className="text-3xl font-bold text-cyan-400 mb-10">
            OptiAsset
          </h1>

          <div className="space-y-3">

            <NavItem
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              href="/employee-dashboard"
              active
            />

            <NavItem
              icon={<Package size={18} />}
              label="Available Assets"
              href="/available-assets"
            />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-500 text-left transition"
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>
        </div>

        {/* Main */}
        <div className="flex-1 p-4 md:p-6">

          {/* Navbar */}
          <div
            className={`rounded-3xl border backdrop-blur-2xl p-6 mb-8 flex justify-between items-center ${
              dark
                ? "bg-white/10 border-white/10"
                : "bg-white/70 border-white"
            }`}
          >
            <div>
              <h1 className="text-3xl font-bold">
                Welcome, {user.name}
              </h1>

              <p className="opacity-70 mt-1">
                Employee Dashboard
              </p>
            </div>

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
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-5 mb-8">

            <GlassCard dark={dark}>
              <div className="flex gap-3 items-center">
                <div className="p-3 rounded-2xl bg-cyan-500 text-white">
                  <User size={20} />
                </div>

                <div>
                  <p className="text-sm opacity-70">
                    Employee Code
                  </p>

                  <h2 className="font-bold text-lg">
                    {user.code}
                  </h2>
                </div>
              </div>
            </GlassCard>

            <GlassCard dark={dark}>
              <div className="flex gap-3 items-center">
                <div className="p-3 rounded-2xl bg-green-500 text-white">
                  <Laptop size={20} />
                </div>

                <div>
                  <p className="text-sm opacity-70">
                    My Assets
                  </p>

                  <h2 className="font-bold text-lg">
                    {myAssets.length}
                  </h2>
                </div>
              </div>
            </GlassCard>

            <GlassCard dark={dark}>
              <div className="flex gap-3 items-center">
                <div className="p-3 rounded-2xl bg-purple-500 text-white">
                  <Package size={20} />
                </div>

                <div>
                  <p className="text-sm opacity-70">
                    Department
                  </p>

                  <h2 className="font-bold text-lg">
                    {user.department}
                  </h2>
                </div>
              </div>
            </GlassCard>

          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* My Assets */}
            <GlassPanel dark={dark} title="My Assets">

              <div className="space-y-4">
                {myAssets.map((item, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl p-4 ${
                      dark
                        ? "bg-white/5 border border-white/10"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <h3 className="font-semibold">
                      {item.asset_name}
                    </h3>

                    <p className="text-sm opacity-70">
                      {item.asset_tag}
                    </p>

                    <p className="text-sm mt-2 text-green-500">
                      {item.status}
                    </p>
                  </div>
                ))}
              </div>

            </GlassPanel>

            {/* Report Issue */}
            <GlassPanel dark={dark} title="Report Issue">

              <div className="space-y-4">

                <input
                  placeholder="Asset Tag"
                  value={issue.asset}
                  onChange={(e) =>
                    setIssue({
                      ...issue,
                      asset: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
                />

                <input
                  placeholder="Issue Type"
                  value={issue.type}
                  onChange={(e) =>
                    setIssue({
                      ...issue,
                      type: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
                />

                <textarea
                  placeholder="Description"
                  rows={4}
                  value={issue.description}
                  onChange={(e) =>
                    setIssue({
                      ...issue,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
                />

                <button
                  onClick={submitIssue}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 p-3 rounded-2xl font-semibold flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Submit Issue
                </button>

              </div>

            </GlassPanel>

          </div>

        </div>
      </div>
    </div>
  );
}

/* Sidebar Item */
function NavItem({
  icon,
  label,
  href,
  active,
}: any) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
        active
          ? "bg-cyan-500 text-white"
          : "hover:bg-white/10"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function GlassCard({
  children,
  dark,
}: any) {
  return (
    <div
      className={`rounded-3xl p-5 border backdrop-blur-2xl ${
        dark
          ? "bg-white/10 border-white/10"
          : "bg-white/70 border-white"
      }`}
    >
      {children}
    </div>
  );
}

function GlassPanel({
  title,
  children,
  dark,
}: any) {
  return (
    <div
      className={`rounded-3xl p-6 border backdrop-blur-2xl ${
        dark
          ? "bg-white/10 border-white/10"
          : "bg-white/70 border-white"
      }`}
    >
      <h2 className="text-2xl font-bold mb-5">
        {title}
      </h2>

      {children}
    </div>
  );
}