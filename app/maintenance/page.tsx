"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  getMaintenance,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} from "@/lib/api";
import { getAssets } from "@/lib/api";

export default function MaintenancePage() {
  const [maintenanceLogs, setMaintenanceLogs] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLog, setCurrentLog] = useState<any>(null);
  const [formData, setFormData] = useState({
    asset_id: 0,
    issue: "",
    status: "Pending",
    notes: "",
  });

  const user = {
    role: "Admin",
  };

  useEffect(() => {
    async function fetchData() {
      const [maintenanceData, assetsData] = await Promise.all([
        getMaintenance(),
        getAssets(),
      ]);

      if (maintenanceData) setMaintenanceLogs(maintenanceData);
      if (assetsData) setAssets(assetsData);
      setLoading(false);
    }

    fetchData();
  }, []);

  const handleDelete = async (logId: number) => {
    if (confirm("Are you sure you want to delete this maintenance log?")) {
      const result = await deleteMaintenance(logId);
      if (result) {
        const data = await getMaintenance();
        if (data) {
          setMaintenanceLogs(data);
        }
      } else {
        console.error("Failed to delete maintenance log");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.asset_id || !formData.issue.trim()) {
      alert("Asset and Issue are required");
      return;
    }

    let result;
    if (isEditing && currentLog) {
      result = await updateMaintenance(currentLog.maintenance_id, formData);
    } else {
      result = await createMaintenance(formData);
    }

    if (result) {
      const data = await getMaintenance();
      if (data) {
        setMaintenanceLogs(data);
      }
      setIsModalOpen(false);
      setFormData({ asset_id: 0, issue: "", status: "Pending", notes: "" });
      setIsEditing(false);
      setCurrentLog(null);
    } else {
      console.error("Failed to save maintenance log");
    }
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentLog(null);
    setFormData({ asset_id: 0, issue: "", status: "Pending", notes: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (log: any) => {
    setIsEditing(true);
    setCurrentLog(log);
    setFormData({
      asset_id: log.asset_id || 0,
      issue: log.issue || "",
      status: log.status || "Pending",
      notes: log.notes || "",
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
            Maintenance Management
          </h1>
          <Button onClick={openCreateModal}>Add Maintenance Log</Button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-400">Loading...</p>
        ) : maintenanceLogs.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">No maintenance logs found</p>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Asset Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Issue / Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date Logged
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Updated By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {maintenanceLogs.map((log) => (
                  <tr key={log.maintenance_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {log.asset_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {log.issue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {log.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {log.date_logged}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {log.updated_by || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(log)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(log.maintenance_id)}
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
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Maintenance Log" : "Add Maintenance Log"}</h2>
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
                <label className="block text-sm font-medium mb-1">Issue / Reason</label>
                <input
                  type="text"
                  value={formData.issue}
                  onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                  placeholder="Enter issue or reason"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Enter additional notes (optional)"
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