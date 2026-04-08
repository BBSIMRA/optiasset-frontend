"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  deactivateEmployee,
} from "@/lib/api";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department_id: 0,
    designation: "",
    employment_status: "Active",
  });

  const user = {
    role: "Admin",
  };

  useEffect(() => {
    async function fetchEmployees() {
      const data = await getEmployees();
      if (data) {
        setEmployees(data);
      }
      setLoading(false);
    }

    fetchEmployees();
  }, []);

  const handleDelete = async (employeeId: number) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      const result = await deleteEmployee(employeeId);
      if (result) {
        const data = await getEmployees();
        if (data) {
          setEmployees(data);
        }
      } else {
        console.error("Failed to delete employee");
      }
    }
  };

  const handleDeactivate = async (employeeId: number) => {
    if (confirm("Are you sure you want to deactivate this employee?")) {
      const result = await deactivateEmployee(employeeId);
      if (result) {
        const data = await getEmployees();
        if (data) {
          setEmployees(data);
        }
      } else {
        console.error("Failed to deactivate employee");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Name and email are required");
      return;
    }

    const payload = {
      ...formData,
      department_id: Number(formData.department_id),
    };

    try {
      const result = await createEmployee(payload);
      if (result) {
        alert("Employee created successfully");
        setFormData({
          name: "",
          email: "",
          department_id: 0,
          designation: "",
          employment_status: "Active",
        });
      } else {
        console.error("Failed to create employee");
      }
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentEmployee(null);
    setFormData({
      name: "",
      email: "",
      department_id: 0,
      designation: "",
      employment_status: "Active",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (employee: any) => {
    setIsEditing(true);
    setCurrentEmployee(employee);
    setFormData({
      name: employee.name || "",
      email: employee.email || "",
      department_id: employee.department_id || 0,
      designation: employee.designation || "",
      employment_status: employee.status || "Active",
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
            Employees Management
          </h1>
          <Button onClick={openCreateModal}>Add Employee</Button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-400">Loading...</p>
        ) : employees.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">No employees found</p>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Designation
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
                {employees.map((employee) => (
                  <tr key={employee.employee_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {employee.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {employee.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {employee.department_name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {employee.designation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {employee.status || "Active"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(employee)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(employee.employee_id)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeactivate(employee.employee_id)}
                        >
                          Deactivate
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
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Employee" : "Add Employee"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Department ID</label>
                <input
                  type="number"
                  value={formData.department_id}
                  onChange={(e) => setFormData({ ...formData, department_id: parseInt(e.target.value) || 0 })}
                  placeholder="Enter department ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Designation</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="Enter designation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Employment Status</label>
                <select
                  value={formData.employment_status}
                  onChange={(e) => setFormData({ ...formData, employment_status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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