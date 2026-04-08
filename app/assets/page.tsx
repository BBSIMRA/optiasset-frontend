"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { getAssets, deleteAsset, createAsset, updateAsset } from "@/lib/api"

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentAsset, setCurrentAsset] = useState<any>(null)
  const [formData, setFormData] = useState({
    asset_name: "",
    asset_category: "",
    asset_status: "",
    asset_condition: "",
    purchase_date: "",
    purchase_cost: 0
  })

  const user = {
    role: "Admin"
  }

  useEffect(() => {
    async function fetchAssets() {
      const data = await getAssets()
      if (data) {
        setAssets(data)
      }
      setLoading(false)
    }

    fetchAssets()
  }, [])

  const handleDelete = async (assetId: number) => {
    if (confirm("Are you sure you want to delete this asset?")) {
      const result = await deleteAsset(assetId)
      if (result) {
        // Refresh the list
        const data = await getAssets()
        if (data) {
          setAssets(data)
        }
      } else {
        console.error("Failed to delete asset")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.asset_name.trim() || !formData.purchase_date.trim()) {
      alert("Asset name and purchase date are required")
      return
    }

    const payload = {
      ...formData,
      purchase_cost: Number(formData.purchase_cost),
    }

    try {
      const result = await createAsset(payload)
      if (result) {
        alert("Asset created successfully")
        setFormData({
          asset_name: "",
          asset_category: "",
          asset_status: "",
          asset_condition: "",
          purchase_date: "",
          purchase_cost: 0
        })
      } else {
        console.error("Failed to create asset")
      }
    } catch (error) {
      console.error("Error creating asset:", error)
    }
  }

  const openCreateModal = () => {
    setIsEditing(false)
    setCurrentAsset(null)
    setFormData({ asset_name: "", asset_category: "", asset_status: "", asset_condition: "", purchase_date: "", purchase_cost: 0 })
    setIsModalOpen(true)
  }

  const openEditModal = (asset: any) => {
    setIsEditing(true)
    setCurrentAsset(asset)
    setFormData({
      asset_name: asset.asset_name || "",
      asset_category: asset.asset_category || "",
      asset_status: asset.asset_status || "",
      asset_condition: asset.asset_condition || "",
      purchase_date: asset.purchase_date || "",
      purchase_cost: asset.purchase_cost || 0
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
            Assets Management
          </h1>
          <Button onClick={openCreateModal}>Add Asset</Button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-400">Loading...</p>
        ) : assets.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">No assets found</p>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Asset Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Purchase Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Purchase Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {assets.map((asset) => (
                  <tr key={asset.asset_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {asset.asset_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {asset.asset_category || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {asset.asset_status || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {asset.asset_condition || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {asset.purchase_date || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {asset.purchase_cost || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(asset)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(asset.asset_id)}
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
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Asset" : "Add Asset"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Asset Name</label>
                <input
                  type="text"
                  value={formData.asset_name}
                  onChange={(e) => setFormData({ ...formData, asset_name: e.target.value })}
                  placeholder="Enter asset name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  value={formData.asset_category}
                  onChange={(e) => setFormData({ ...formData, asset_category: e.target.value })}
                  placeholder="Enter category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <input
                  type="text"
                  value={formData.asset_status}
                  onChange={(e) => setFormData({ ...formData, asset_status: e.target.value })}
                  placeholder="Enter status"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Condition</label>
                <input
                  type="text"
                  value={formData.asset_condition}
                  onChange={(e) => setFormData({ ...formData, asset_condition: e.target.value })}
                  placeholder="Enter condition"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Purchase Date</label>
                <input
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Purchase Cost</label>
                <input
                  type="number"
                  value={formData.purchase_cost}
                  onChange={(e) => setFormData({ ...formData, purchase_cost: Number(e.target.value)})} 
                  placeholder="Enter purchase cost"
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
  )
}