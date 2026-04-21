"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle,
  XCircle,
  Sun,
  Moon,
} from "lucide-react";
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "@/lib/api";
import RequestAssetModal from "@/components/RequestAssetModal";

// Notification function
const notify = (msg: string) => alert(msg);

// Define TypeScript interface for assignments
type Assignment = {
  assignment_id?: number;
  id?: number;
  employee_id: number;
  asset_id: number;
  assigned_date?: string;
  expected_return_date?: string;
  assignment_status?: string;
};

export default function AssignmentsPage() {
  const [dark, setDark] = useState(true);
  const [search, setSearch] = useState("");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setDark(theme !== "light");

    loadAssignments();
  }, []);

  async function loadAssignments() {
    setLoading(true);
    try {
      const data = await getAssignments();
      setAssignments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load assignments:", error);
      notify("Failed to load assignments. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddAssignment(payload: any) {
    try {
      await createAssignment(payload);
      notify("Assignment added successfully!");
      setIsModalOpen(false);
      loadAssignments();
    } catch (error) {
      console.error("Failed to add assignment:", error);
      notify("Failed to add assignment. Please try again later.");
    }
  }

  async function handleEditAssignment(id: number, payload: any) {
    try {
      await updateAssignment(id, payload);
      notify("Assignment updated successfully!");
      setIsModalOpen(false);
      loadAssignments();
    } catch (error) {
      console.error("Failed to update assignment:", error);
      notify("Failed to update assignment. Please try again later.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete assignment?")) return;

    try {
      await deleteAssignment(id);
      notify("Assignment deleted successfully!");
      loadAssignments();
    } catch (error) {
      console.error("Failed to delete assignment:", error);
      notify("Failed to delete assignment. Please try again later.");
    }
  }

  async function approveRequest(id: number) {
    console.log("approve", id);
  }

  async function rejectRequest(id: number) {
    console.log("reject", id);
  }

  const filteredAssignments = assignments.filter((item) =>
    `${item.assignment_id || item.id} ${item.employee_id} ${item.asset_id} ${item.assignment_status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen ${dark ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
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
            <NavItem href="/dashboard" label="Dashboard" />
            <NavItem href="/employees" label="Employees" />
            <NavItem href="/departments" label="Departments" />
            <NavItem href="/assets" label="Assets" />
            <NavItem href="/assignments" label="Assignments" active />
            <NavItem href="/maintenance" label="Maintenance" />
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
              <h1 className="text-3xl font-bold">Assignments</h1>
              <p className="opacity-70 mt-1">Manage assignments & requests</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDark(!dark);
                  localStorage.setItem("theme", dark ? "light" : "dark");
                }}
                className="p-3 rounded-2xl bg-white/10 border border-white/10"
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={() => {
                  setSelectedAssignment(null);
                  setIsModalOpen(true);
                }}
                className="px-5 py-3 rounded-2xl bg-cyan-500 text-white flex items-center gap-2"
              >
                <Plus size={18} />
                New Assignment
              </button>
            </div>
          </div>

          {/* Modal for Adding/Editing Assignment */}
          {isModalOpen && (
            <RequestAssetModal
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              asset={selectedAssignment}
            />
          )}

          {/* Search */}
          <div
            className={`rounded-3xl border backdrop-blur-2xl p-4 mb-6 flex items-center gap-3 ${
              dark
                ? "bg-white/10 border-white/10"
                : "bg-white/70 border-white"
            }`}
          >
            <Search size={18} />

            <input
              placeholder="Search assignments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>

          {/* Assignments Table */}
          <div
            className={`rounded-3xl border backdrop-blur-2xl p-6 ${
              dark
                ? "bg-white/10 border-white/10"
                : "bg-white/70 border-white"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="opacity-70">
                    <th className="text-left py-3">ID</th>
                    <th className="text-left py-3">Employee</th>
                    <th className="text-left py-3">Asset</th>
                    <th className="text-left py-3">Assigned</th>
                    <th className="text-left py-3">Return</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAssignments.map((item) => (
                    <tr
                      key={item.assignment_id || item.id}
                      className="border-t border-white/10"
                    >
                      <td className="py-4">
                        {item.assignment_id || item.id}
                      </td>

                      <td>#{item.employee_id}</td>

                      <td>#{item.asset_id}</td>

                      <td>{item.assigned_date || "N/A"}</td>

                      <td>{item.expected_return_date || "N/A"}</td>

                      <td>
                        <StatusBadge
                          status={item.assignment_status || "Unknown"}
                        />
                      </td>

                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedAssignment(item);
                              setIsModalOpen(true);
                            }}
                            className="p-2 rounded-xl bg-green-500 text-white"
                          >
                            <RotateCcw size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(item.assignment_id || item.id!)}
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
function NavItem({ href, label, active }: any) {
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

/* Status Badge */
function StatusBadge({ status }: any) {
  const color =
    status === "Assigned"
      ? "bg-yellow-500/20 text-yellow-500"
      : status === "Returned"
      ? "bg-green-500/20 text-green-500"
      : "bg-red-500/20 text-red-500";

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${color}`}>
      {status}
    </span>
  );
}