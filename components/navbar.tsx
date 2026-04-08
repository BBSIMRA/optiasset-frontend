export default function Navbar() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-bold text-black dark:text-white">
        OptiAsset
      </h1>

      <button className="px-3 py-1 bg-red-500 text-white rounded">
        Logout
      </button>
    </div>
  )
}
