"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Boxes,
  Search,
  Plus,
  Pencil,
  Trash2,
  Sun,
  Moon,
} from "lucide-react";

import {
  getAssets,
  deleteAsset,
} from "@/lib/api";

export default function AssetsPage() {
  const [dark, setDark] = useState(true);
  const [assets, setAssets] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setDark(saved !== "light");

    loadAssets();
  }, []);

  async function loadAssets() {
    try {
      const data: any = await getAssets();

      const arr = Array.isArray(data)
        ? data
        : data?.assets || data?.data || [];

      setAssets(arr);
    } catch {}
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete asset?")) return;

    try {
      await deleteAsset(id);
      loadAssets();
    } catch {}
  }

  const filtered = assets.filter((item) =>
    `${item.asset_name} ${item.asset_tag} ${item.brand}`
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
            <NavItem active href="/assets" label="Assets" />
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
                Assets
              </h1>

              <p className={`${dark ? "text-gray-300" : "text-gray-600"}`}>
                Manage asset inventory
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
                Add Asset
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
              placeholder="Search assets..."
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
                    <th className="text-left py-3">Tag</th>
                    <th className="text-left py-3">Asset</th>
                    <th className="text-left py-3">Brand</th>
                    <th className="text-left py-3">Model</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((item: any) => (
                    <tr
                      key={item.asset_id}
                      className={`border-t ${
                        dark
                          ? "border-white/10"
                          : "border-gray-200"
                      }`}
                    >
                      <td className="py-4">
                        {item.asset_id}
                      </td>

                      <td>
                        {item.asset_tag}
                      </td>

                      <td>
                        {item.asset_name}
                      </td>

                      <td>
                        {item.brand}
                      </td>

                      <td>
                        {item.model}
                      </td>

                      <td>
                        <StatusBadge status={item.asset_status} />
                      </td>

                      <td>
                        <div className="flex gap-2">

                          <button className="p-2 rounded-xl bg-blue-500 text-white">
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(item.asset_id)
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

/* Status Badge */
function StatusBadge({ status }: any) {
  const color =
    status === "Available"
      ? "bg-green-500/20 text-green-500"
      : status === "Assigned"
      ? "bg-yellow-500/20 text-yellow-500"
      : "bg-red-500/20 text-red-500";

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${color}`}>
      {status}
    </span>
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