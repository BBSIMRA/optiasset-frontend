"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wrench,
  Search,
  Plus,
  Pencil,
  Trash2,
  Sun,
  Moon,
} from "lucide-react";

import { getMaintenanceLogs, deleteMaintenanceLog } from "@/lib/api";

export default function MaintenancePage() {
  const [dark, setDark] = useState(true);
  const [records, setRecords] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setDark(saved !== "light");

    loadMaintenance();
  }, []);

  async function loadMaintenance() {
    try {
      const data: any = await getMaintenanceLogs();

      const arr = Array.isArray(data)
        ? data
        : data?.maintenance || data?.data || [];

      setRecords(arr);
    } catch {}
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete maintenance record?")) return;

    try {
      await deleteMaintenanceLog(id);
      loadMaintenance();
    } catch {}
  }

  const filtered = records.filter((item) =>
    `${item.maintenance_type} ${item.performed_by} ${item.asset_id}`
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
            <NavItem href="/departments" label="Departments" />
            <NavItem href="/assets" label="Assets" />
            <NavItem href="/assignments" label="Assignments" />
            <NavItem active href="/maintenance" label="Maintenance" />
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
                Maintenance
              </h1>

              <p className={`${dark ? "text-gray-300" : "text-gray-600"}`}>
                Manage maintenance records
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
                Add Record
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
              placeholder="Search maintenance..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>

          {/* Table */}
          <div
            className={`rounded-3xl p-6 border backdrop-blur-xl ${
              dark
                ? "bg-white/10 border-white/20"
                : "bg-white/70 border-white"
            }`}
          >
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className={`${dark ? "text-gray-300" : "text-gray-600"}`}>
                    <th className="text-left py-3">ID</th>
                    <th className="text-left py-3">Asset</th>
                    <th className="text-left py-3">Type</th>
                    <th className="text-left py-3">Cost</th>
                    <th className="text-left py-3">Date</th>
                    <th className="text-left py-3">Performed By</th>
                    <th className="text-left py-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((item: any) => (
                    <tr
                      key={item.maintenance_id}
                      className={`border-t ${
                        dark
                          ? "border-white/10"
                          : "border-gray-200"
                      }`}
                    >
                      <td className="py-4">
                        {item.maintenance_id}
                      </td>

                      <td>
                        Asset #{item.asset_id}
                      </td>

                      <td>
                        {item.maintenance_type}
                      </td>

                      <td>
                        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-sm">
                          ₹ {item.maintenance_cost}
                        </span>
                      </td>

                      <td>
                        {item.maintenance_date}
                      </td>

                      <td>
                        {item.performed_by}
                      </td>

                      <td>
                        <div className="flex gap-2">

                          <button className="p-2 rounded-xl bg-blue-500 text-white">
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(item.maintenance_id)
                            }
                            className="p-2 rounded-xl bg-red-500 text-white"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
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