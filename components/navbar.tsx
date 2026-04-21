"use client";

type NavbarProps = {
  role?: string;
};

export default function Navbar({
  role = "Admin",
}: NavbarProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-xl font-bold text-black dark:text-white">
          OptiAsset
        </h1>

        <p className="text-gray-500 text-sm">
          Welcome, {role}
        </p>
      </div>

      <button className="px-3 py-1 bg-red-500 text-white rounded">
        Logout
      </button>
    </div>
  );
}