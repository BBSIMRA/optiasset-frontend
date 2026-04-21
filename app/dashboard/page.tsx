"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Boxes,
  ClipboardList,
  Wrench,
  Building2,
  Bell,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";

import {
  getStats,
  getEmployees,
  getAssets,
  getAssignments,
  getMaintenanceLogs,
  logoutUser,
} from "@/lib/api";

export default function DashboardPage() {
  const [dark, setDark] = useState(true);

  const [user, setUser] = useState<any>({
    name: "Admin",
    role: "HR",
  });

  const [stats, setStats] = useState<any>({});
  const [employees, setEmployees] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);

  /* Theme */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setDark(savedTheme !== "light");

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {}
    }

    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  async function loadData() {
    try {
      const statsData = await getStats();
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load stats:", error);
      alert("Failed to load stats. Please try again later.");
    }

    try {
      const employeesData = await getEmployees();
      setEmployees(employeesData.slice(0, 5)); // Backend returns a direct list
    } catch (error) {
      console.error("Failed to load employees:", error);
      alert("Failed to load employees. Please try again later.");
    }

    try {
      const assetsData = await getAssets();
      setAssets(assetsData.slice(0, 5)); // Backend returns a direct list
    } catch (error) {
      console.error("Failed to load assets:", error);
      alert("Failed to load assets. Please try again later.");
    }

    try {
      const assignmentsData = await getAssignments();
      setAssignments(assignmentsData.slice(0, 5)); // Backend returns a direct list
    } catch (error) {
      console.error("Failed to load assignments:", error);
      alert("Failed to load assignments. Please try again later.");
    }

    try {
      const maintenanceData = await getMaintenanceLogs();
      setMaintenance(maintenanceData.slice(0, 5)); // Backend returns a direct list
    } catch (error) {
      console.error("Failed to load maintenance logs:", error);
      alert("Failed to load maintenance logs. Please try again later.");
    }
  }

  async function handleLogout() {
    await logoutUser();
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <div
      className={`min-h-screen flex transition-all duration-500 ${
        dark
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
          : "bg-gradient-to-br from-cyan-100 via-white to-blue-100 text-black"
      }`}
    >
      {/* Sidebar */}
      <div
        className={`w-72 m-4 rounded-3xl backdrop-blur-xl shadow-2xl border p-6 hidden md:flex flex-col ${
          dark
            ? "bg-white/10 border-white/20 text-white"
            : "bg-white/70 border-white text-black"
        }`}
      >
        <h1 className="text-3xl font-bold text-cyan-400 mb-10">
          OptiAsset
        </h1>

        <div className="space-y-3 flex-1">
          <SideItem dark={dark} icon={<LayoutDashboard size={18} />} label="Dashboard" href="/dashboard" />
          <SideItem dark={dark} icon={<Users size={18} />} label="Employees" href="/employees" />
          <SideItem dark={dark} icon={<Building2 size={18} />} label="Departments" href="/departments" />
          <SideItem dark={dark} icon={<Boxes size={18} />} label="Assets" href="/assets" />
          <SideItem dark={dark} icon={<ClipboardList size={18} />} label="Assignments" href="/assignments" />
          <SideItem dark={dark} icon={<Wrench size={18} />} label="Maintenance" href="/maintenance" />
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white rounded-2xl px-4 py-3 flex items-center gap-2 mt-5"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 p-4">

        {/* Navbar */}
        <div
          className={`rounded-3xl backdrop-blur-xl shadow-xl border px-6 py-5 mb-8 flex justify-between items-center ${
            dark
              ? "bg-white/10 border-white/20"
              : "bg-white/70 border-white"
          }`}
        >
          <div>
            <h1 className={`text-3xl font-bold ${dark ? "text-white" : "text-black"}`}>
              Welcome, {user.name}
            </h1>

            <p className={`${dark ? "text-gray-300" : "text-gray-600"} mt-1`}>
              {user.role} Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              className={`p-3 rounded-2xl ${
                dark ? "bg-white/10" : "bg-gray-100"
              }`}
            >
              <Bell size={18} />
            </button>

            {/* Theme Toggle */}
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


            <div className="w-10 h-10 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold">
              {user.name?.charAt(0)}
            </div>

          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-5 gap-5 mb-8">
          <Card dark={dark} title="Employees" value={stats.total_employees} />
          <Card dark={dark} title="Assets" value={stats.total_assets} />
          <Card dark={dark} title="Departments" value={stats.total_departments} />
          <Card dark={dark} title="Assignments" value={stats.active_assignments} />
          <Card dark={dark} title="Maintenance" value={stats.maintenance_logs} />
        </div>

        {/* Tables */}
        <div className="grid md:grid-cols-2 gap-6">
          <Table dark={dark} title="Recent Employees" data={employees} />
          <Table dark={dark} title="Recent Assets" data={assets} />
          <Table dark={dark} title="Recent Assignments" data={assignments} />
          <Table dark={dark} title="Recent Maintenance" data={maintenance} />
        </div>

      </div>
    </div>
  );
}

/* Sidebar Link */
function SideItem({ dark, icon, label, href }: any) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
        dark ? "hover:bg-white/10" : "hover:bg-gray-100"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

/* Cards */
function Card({ dark, title, value }: any) {
  return (
    <div
      className={`rounded-3xl backdrop-blur-xl shadow-xl border p-5 ${
        dark
          ? "bg-white/10 border-white/20"
          : "bg-white/70 border-white"
      }`}
    >
      <p className={`${dark ? "text-gray-300" : "text-gray-600"}`}>
        {title}
      </p>

      <h2 className={`text-3xl font-bold mt-3 ${
        dark ? "text-cyan-300" : "text-blue-600"
      }`}>
        {value || 0}
      </h2>
    </div>
  );
}

/* Tables */
function Table({ dark, title, data }: any) {
  return (
    <div
      className={`rounded-3xl backdrop-blur-xl shadow-xl border p-5 ${
        dark
          ? "bg-white/10 border-white/20"
          : "bg-white/70 border-white"
      }`}
    >
      <h2 className={`text-xl font-bold mb-4 ${
        dark ? "text-white" : "text-black"
      }`}>
        {title}
      </h2>

      {data.length === 0 ? (
        <p className={`${dark ? "text-gray-400" : "text-gray-500"}`}>
          No records found
        </p>
      ) : (
        data.map((item: any, i: number) => (
          <div
            key={i}
            className={`border-b py-3 text-sm ${
              dark
                ? "border-white/10 text-gray-200"
                : "border-gray-200 text-gray-700"
            }`}
          >
            {Object.values(item).slice(0, 3).join(" | ")}
          </div>
        ))
      )}
    </div>
  );
}