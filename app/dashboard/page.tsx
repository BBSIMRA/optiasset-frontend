"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { getStats } from "@/lib/api"

export default function Dashboard() {

  const [stats, setStats] = useState<any>(null)

  const user = {
    role: "Admin"
  }

  useEffect(() => {
    async function fetchData() {
      const data = await getStats()
      setStats(data)
    }

    fetchData()
  }, [])

  return (
    <div className="flex">

      <Sidebar role={user.role} />

      <div className="flex-1 p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">

        <Navbar />

        <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">
          Dashboard
        </h1>

        {!stats ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <Card>
              <CardContent className="p-5">
                <h2>Total Assets</h2>
                <p className="text-2xl font-bold">{stats.assets}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h2>Employees</h2>
                <p className="text-2xl font-bold">{stats.employees}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h2>Departments</h2>
                <p className="text-2xl font-bold">{stats.departments}</p>
              </CardContent>
            </Card>

          </div>
        )}

      </div>
    </div>
  )
}