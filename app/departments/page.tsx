"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  Plus,
  Pencil,
  Trash2,
  Sun,
  Moon,
} from "lucide-react";

import {
  getDepartments,
  deleteDepartment,
} from "@/lib/api";

export default function DepartmentsPage() {
  const [dark, setDark] = useState(true);
  const [departments, setDepartments] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setDark(saved !== "light");

    loadDepartments();
  }, []);

  async function loadDepartments() {
    try {
      const data: any = await getDepartments();

      const arr = Array.isArray(data)
        ? data
        : data?.departments || data?.data || [];

      setDepartments(arr);
    } catch {}
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete department?")) return;

    try {
      await deleteDepartment(id);
      loadDepartments();
    } catch {}
  }

  const filtered = departments.filter((dept) =>
    `${dept.department_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        dark
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
          : "bg-gradient-to-br from-cyan-100 via-white to-blue-100 text-black"
      }`}
    >
      <div className="flex">

        {/* Sidebar */}
        <div
          className={`w-72 m-4 rounded-3xl p-6 border backdrop-blur-xl hidden md:block ${
            dark
              ? "bg-white/10 border-white/20"
              : "bg-white/70 border-white"
          }`}
        >
          <h1 className="text-3xl font-bold text-cyan-400 mb-10">
            OptiAsset
          </h1>

          <div className="space-y-3">
            <NavItem href="/dashboard" label="Dashboard" />
            <NavItem href="/employees" label="Employees" />
            <NavItem active href="/departments" label="Departments" />
            <NavItem href="/assets" label="Assets" />
            <NavItem href="/assignments" label="Assignments" />
            <NavItem href="/maintenance" label="Maintenance" />
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 p-4">

          {/* Navbar */}
          <div
            className={`rounded-3xl p-6 mb-8 border backdrop-blur-xl flex justify-between items-center ${
              dark
                ? "bg-white/10 border-white/20"
                : "bg-white/70 border-white"
            }`}
          >
            <div>
              <h1 className="text-3xl font-bold">
                Departments
              </h1>

              <p className={`${dark ? "text-gray-300" : "text-gray-600"}`}>
                Manage organization departments
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

              <button className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white flex items-center gap-2">
                <Plus size={18} />
                Add Department
              </button>

            </div>
          </div>

          {/* Search */}
          <div
            className={`rounded-3xl p-4 mb-6 border backdrop-blur-xl flex items-center gap-3 ${
              dark
                ? "bg-white/10 border-white/20"
                : "bg-white/70 border-white"
            }`}
          >
            <Search size={18} />

            <input
              placeholder="Search departments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-5">

            {filtered.map((dept: any) => (
              <div
                key={dept.department_id}
                className={`rounded-3xl p-6 border backdrop-blur-xl shadow-xl ${
                  dark
                    ? "bg-white/10 border-white/20"
                    : "bg-white/70 border-white"
                }`}
              >
                <div className="flex justify-between items-start">

                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500 text-white flex items-center justify-center mb-4">
                      <Building2 size={22} />
                    </div>

                    <h2 className="text-xl font-bold">
                      {dept.department_name}
                    </h2>

                    <p className={`${dark ? "text-gray-300" : "text-gray-600"} mt-2`}>
                      Department ID: {dept.department_id}
                    </p>
                  </div>

                  <div className="flex gap-2">

                    <button className="p-2 rounded-xl bg-blue-500 text-white">
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(dept.department_id)
                      }
                      className="p-2 rounded-xl bg-red-500 text-white"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </div>
              </div>
            ))}

          </div>

        </div>
      </div>
    </div>
  );
}

/* Sidebar */
function NavItem({
  href,
  label,
  active,
}: any) {
  return (
    <Link
      href={href}
      className={`block px-4 py-3 rounded-2xl transition ${
        active
          ? "bg-cyan-500 text-white"
          : "hover:bg-white/10"
      }`}
    >
      {label}
    </Link>
  );
}