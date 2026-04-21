"use client";

import RequestAssetModal from "@/components/RequestAssetModal";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Package,
  LayoutDashboard,
  LogOut,
  Moon,
  Sun,
  Search,
  CheckCircle2,
} from "lucide-react";

import { logoutUser } from "@/lib/api";

export default function AvailableAssetsPage() {
  const [dark, setDark] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  const [assets] = useState<any[]>([
    {
      asset_tag: "LAP-2001",
      asset_name: "HP ProBook Laptop",
      category: "Laptop",
      status: "Available",
    },
    {
      asset_tag: "MON-3022",
      asset_name: "LG 24 Monitor",
      category: "Monitor",
      status: "Available",
    },
    {
      asset_tag: "KEY-1102",
      asset_name: "Mechanical Keyboard",
      category: "Accessory",
      status: "Available",
    },
    {
      asset_tag: "TAB-5009",
      asset_name: "Samsung Tablet",
      category: "Tablet",
      status: "Available",
    },
  ]);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setDark(theme !== "light");
  }, []);

  async function handleLogout() {
    await logoutUser();
    localStorage.clear();
    window.location.href = "/";
  }

  const filteredAssets = assets.filter((item) =>
    `${item.asset_name} ${item.asset_tag} ${item.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
            />

            <NavItem
              icon={<Package size={18} />}
              label="Available Assets"
              href="/available-assets"
              active
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
                Available Assets
              </h1>

              <p className="opacity-70 mt-1">
                Browse free company assets
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

          {/* Search */}
          <div
            className={`rounded-3xl border backdrop-blur-2xl p-5 mb-8 ${
              dark
                ? "bg-white/10 border-white/10"
                : "bg-white/70 border-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <Search size={18} />

              <input
                placeholder="Search assets..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Assets Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredAssets.map((item, i) => (
              <div
                key={i}
                className={`rounded-3xl border backdrop-blur-2xl p-6 transition hover:scale-[1.02] ${
                  dark
                    ? "bg-white/10 border-white/10"
                    : "bg-white/70 border-white"
                }`}
              >
                <div className="flex items-center justify-between mb-5">

                  <div className="p-4 rounded-2xl bg-cyan-500 text-white">
                    <Package size={22} />
                  </div>

                  <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-500">
                    Available
                  </span>

                </div>

                <h2 className="text-xl font-bold">
                  {item.asset_name}
                </h2>

                <p className="opacity-70 mt-2">
                  {item.asset_tag}
                </p>

                <p className="opacity-70">
                  {item.category}
                </p>

                <button
  onClick={() => {
    setSelectedAsset(item);
    setOpen(true);
  }}
  className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-2xl font-semibold"
>
  Request Asset
</button>
              </div>
            ))}

          </div>

        </div>
      </div>
      <RequestAssetModal
  open={open}
  asset={selectedAsset}
  onClose={() => setOpen(false)}
/>
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