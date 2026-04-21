"use client";

import Link from "next/link";

type SidebarProps = {
  role?: string;
};

export default function Sidebar({
  role = "Admin",
}: SidebarProps) {
  return (
    <div className="w-64 min-h-screen bg-white dark:bg-slate-900 shadow-xl p-5">

      <h1 className="text-2xl font-bold mb-2 text-blue-600">
        OptiAsset
      </h1>

      <p className="text-sm text-gray-500 mb-6">
        {role}
      </p>

      <nav className="space-y-3">

        <Link href="/dashboard" className="block hover:text-blue-600">
          Dashboard
        </Link>

        <Link href="/employees" className="block hover:text-blue-600">
          Employees
        </Link>

        <Link href="/departments" className="block hover:text-blue-600">
          Departments
        </Link>

        <Link href="/assets" className="block hover:text-blue-600">
          Assets
        </Link>

        <Link href="/assignments" className="block hover:text-blue-600">
          Assignments
        </Link>

        <Link href="/maintenance" className="block hover:text-blue-600">
          Maintenance
        </Link>

      </nav>
    </div>
  );
}