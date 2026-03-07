"use client"

import Link from "next/link"

export default function Sidebar({ role }: { role: string }) {

  const adminLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Manage Inventory", path: "/assets" },
    { name: "All Users", path: "/users" }
  ]

  const employeeLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "My Gear", path: "/my-assets" }
  ]

  const links = role === "Admin" ? adminLinks : employeeLinks

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5">
      <h2 className="text-xl font-bold mb-5">OptiAsset</h2>

      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <Link href={link.path} className="hover:text-blue-400">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}