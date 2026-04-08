"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "@/lib/api";
import { getAssets, getEmployees } from "@/lib/api";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<any>(null);
  const [formData, setFormData] = useState({
    asset_id: 0,
    employee_id: 0,
    assigned_date: "",
    return_date: "",
  });

  const user = {
    role: "Admin",
  };

  useEffect(() => {
    async function fetchData() {
      const [assignmentsData, assetsData, employeesData] = await Promise.all([
        getAssignments(),
        getAssets(),
        getEmployees(),
      ]);

      if (assignmentsData) setAssignments(assignmentsData);
      if (assetsData) setAssets(assetsData);
      if (employeesData) setEmployees(employeesData);
      setLoading(false);
    }

    fetchData();
  }, []);

  const handleDelete = async (assignmentId: number) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      const result = await deleteAssignment(assignmentId);
      if (result) {
        const data = await getAssignments();
        if (data) {
          setAssignments(data);
        }
      } else {
        console.error("Failed to delete assignment");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.asset_id || !formData.employee_id || !formData.assigned_date) {
      alert("Asset, Employee, and Assigned Date are required");
      return;
    }

    let result;
    if (isEditing && currentAssignment) {
      result = await updateAssignment(currentAssignment.assignment_id, formData);
    } else {
      result = await createAssignment(formData);
    }

    if (result) {
      const data = await getAssignments();
      if (data) {
        setAssignments(data);
      }
      setIsModalOpen(false);
      setFormData({ asset_id: 0, employee_id: 0, assigned_date: "", return_date: "" });
      setIsEditing(false);
      setCurrentAssignment(null);
    } else {
      console.error("Failed to save assignment");
    }
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentAssignment(null);
    setFormData({ asset_id: 0, employee_id: 0, assigned_date: "", return_date: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (assignment: any) => {
    setIsEditing(true);
    setCurrentAssignment(assignment);
    setFormData({
      asset_id: assignment.asset_id || 0,
      employee_id: assignment.employee_id || 0,
      assigned_date: assignment.assigned_date || "",
      return_date: assignment.return_date || "",
    });
    setIsModalOpen(true);
  };

  return (
    <div className="flex">
      <Sidebar role={user.role} />

      <div className="flex-1 p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <Navbar />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Assignments Management
          </h1>
          <Button onClick={openCreateModal}>Add Assignment</Button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-400">Loading...</p>
        ) : assignments.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">No assignments found</p>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Asset Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Assigned Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Return Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {assignments.map((assignment) => (
                  <tr key={assignment.assignment_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {assignment.asset_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {assignment.employee_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {assignment.assigned_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {assignment.return_date || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {assignment.status || "Active"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(assignment)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(assignment.assignment_id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Assignment" : "Add Assignment"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Asset</label>
                <select
                  value={formData.asset_id}
                  onChange={(e) => setFormData({ ...formData, asset_id: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Asset</option>
                  {assets.map((asset) => (
                    <option key={asset.asset_id} value={asset.asset_id}>
                      {asset.asset_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Employee</label>
                <select
                  value={formData.employee_id}
                  onChange={(e) => setFormData({ ...formData, employee_id: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee.employee_id} value={employee.employee_id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assigned Date</label>
                <input
                  type="date"
                  value={formData.assigned_date}
                  onChange={(e) => setFormData({ ...formData, assigned_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Return Date</label>
                <input
                  type="date"
                  value={formData.return_date}
                  onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{isEditing ? "Update" : "Create"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}