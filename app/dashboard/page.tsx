import Sidebar from "@/components/sidebar"

export default function Dashboard() {

  // temporary user role
  const user = {
    role: "Admin"
  }

  return (
    <div className="flex">

      <Sidebar role={user.role} />

      <div className="p-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p>Welcome to OptiAsset</p>
      </div>

    </div>
  )
}