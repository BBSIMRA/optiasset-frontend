"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { getDepartments, deleteDepartment, createDepartment, updateDepartment } from "@/lib/api"

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentDepartment, setCurrentDepartment] = useState<any>(null)
  const [formData, setFormData] = useState({
    department_name: "",
    department_code: ""
  })

  const user = {
    role: "Admin"
  }

  useEffect(() => {
    async function fetchDepartments() {
      const data = await getDepartments()
      if (data) {
        setDepartments(data)
      }
      setLoading(false)
    }

    fetchDepartments()
  }, [])

  const handleDelete = async (departmentId: number) => {
    if (confirm("Are you sure you want to delete this department?")) {
      const result = await deleteDepartment(departmentId)
      if (result) {
        // Refresh the list
        const data = await getDepartments()
        if (data) {
          setDepartments(data)
        }
      } else {
        console.error("Failed to delete department")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.department_name.trim() || !formData.department_code.trim()) {
      alert("Department name and code are required")
      return
    }

    let result
    if (isEditing && currentDepartment) {
      result = await updateDepartment(currentDepartment.department_id, formData)
    } else {
      result = await createDepartment(formData)
    }

    if (result) {
      const data = await getDepartments()
      if (data) {
        setDepartments(data)
      }
      setIsModalOpen(false)
      setFormData({ department_name: "", department_code: "" })
      setIsEditing(false)
      setCurrentDepartment(null)
    } else {
      console.error("Failed to save department")
    }
  }

  const openCreateModal = () => {
    setIsEditing(false)
    setCurrentDepartment(null)
    setFormData({ department_name: "", department_code: "" })
    setIsModalOpen(true)
  }

  const openEditModal = (department: any) => {
    setIsEditing(true)
    setCurrentDepartment(department)
    setFormData({
      department_name: department.department_name || "",
      department_code: department.department_code || ""
    })
    setIsModalOpen(true)
  }

  return (
    <div className="flex">
      <Sidebar role={user.role} />

      <div className="flex-1 p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <Navbar />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Departments Management
          </h1>
          <Button onClick={openCreateModal}>Add Department</Button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-400">Loading...</p>
        ) : departments.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">No departments found</p>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Department Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Department Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {departments.map((department) => (
                  <tr key={department.department_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {department.department_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {department.department_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(department)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(department.department_id)}
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
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Department" : "Add Department"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Department Name</label>
                <input
                  type="text"
                  value={formData.department_name}
                  onChange={(e) => setFormData({ ...formData, department_name: e.target.value })}
                  placeholder="Enter department name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Department Code</label>
                <input
                  type="text"
                  value={formData.department_code}
                  onChange={(e) => setFormData({ ...formData, department_code: e.target.value })}
                  placeholder="Enter department code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
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
  )
}