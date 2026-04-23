"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Sun,
  Moon,
} from "lucide-react";

import {
  getEmployees,
  deleteEmployee,
  createEmployee,
  updateEmployee,
  getDepartments,
  Employee,
  EmployeeForm,
} from "@/lib/api";

type Department = {
  id: number;
  department_name: string;
};

export default function EmployeesPage() {
  const [dark, setDark] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);

  const emptyForm: EmployeeForm = {
    employee_code: "",
    first_name: "",
    last_name: "",
    email: "",
    department_id: 0,
    designation: "",
    employment_status: "Active",
    date_of_joining: "",
  };

  const [form, setForm] = useState<EmployeeForm>(emptyForm);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setDark(saved !== "light");

    loadEmployees();
    loadDepartments();
  }, []);

  async function loadEmployees() {
    try {
      const data = await getEmployees();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadDepartments() {
    try {
      const data = await getDepartments();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete employee?")) return;

    try {
      await deleteEmployee(id);
      loadEmployees();
    } catch {
      alert("Failed to delete");
    }
  }

  async function handleSave() {
    try {
      const payload: EmployeeForm = {
        employee_code: form.employee_code.trim(),
        first_name: form.first_name.trim(),
        last_name: (form.last_name || "").trim(),
        email: form.email.trim(),
        department_id: Number(form.department_id),
        designation: (form.designation || "").trim(),
        employment_status: form.employment_status,
        date_of_joining: form.date_of_joining,
      };

      if (editing) {
        await updateEmployee(editing.id, payload);
      } else {
        await createEmployee(payload);
      }

      setOpen(false);
      setEditing(null);
      setForm(emptyForm);
      loadEmployees();
    } catch (error: any) {
      alert(error.message);
    }
  }

  function getDepartmentName(id: number) {
    const dep = departments.find((d) => d.id === id);
    return dep ? dep.department_name : `#${id}`;
  }

  const filtered = employees.filter((emp) =>
    `${emp.first_name} ${emp.last_name} ${emp.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        dark
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
          : "bg-gradient-to-br from-cyan-100 via-white to-blue-100 text-black"
      }`}
    >
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`w-72 m-4 rounded-3xl p-6 border backdrop-blur-xl hidden md:block ${
            dark
              ? "bg-white/10 border-white/20"
              : "bg-white/70 border-white"
          }`}
        >
          <h1 className="text-3xl font-bold text-cyan-400 mb-10">
            OptiAsset
          </h1>

          <div className="space-y-3">
            <NavItem href="/dashboard" label="Dashboard" />
            <NavItem href="/employees" label="Employees" active />
            <NavItem href="/departments" label="Departments" />
            <NavItem href="/assets" label="Assets" />
            <NavItem href="/assignments" label="Assignments" />
            <NavItem href="/maintenance" label="Maintenance" />
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 p-4">
          {/* Header */}
          <div
            className={`rounded-3xl p-6 mb-8 border backdrop-blur-xl flex justify-between items-center ${
              dark
                ? "bg-white/10 border-white/20"
                : "bg-white/70 border-white"
            }`}
          >
            <div>
              <h1 className="text-3xl font-bold">Employees</h1>
              <p className={dark ? "text-gray-300" : "text-gray-600"}>
                Manage employee records
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDark(!dark);
                  localStorage.setItem(
                    "theme",
                    dark ? "light" : "dark"
                  );
                }}
                className={`p-3 rounded-2xl border ${
                  dark
                    ? "bg-white/10 border-white/10"
                    : "bg-white border-gray-300"
                }`}
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={() => {
                  setEditing(null);
                  setForm(emptyForm);
                  setOpen(true);
                }}
                className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white flex items-center gap-2"
              >
                <Plus size={18} />
                Add Employee
              </button>
            </div>
          </div>

          {/* Search */}
          <div
            className={`rounded-3xl p-4 mb-6 border backdrop-blur-xl flex items-center gap-3 ${
              dark
                ? "bg-white/10 border-white/20"
                : "bg-white/70 border-white"
            }`}
          >
            <Search size={18} />

            <input
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>

          {/* Table */}
          <div
            className={`rounded-3xl p-6 border backdrop-blur-xl ${
              dark
                ? "bg-white/10 border-white/20"
                : "bg-white/70 border-white"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={dark ? "text-gray-300" : "text-gray-600"}>
                    <th className="text-left py-3">ID</th>
                    <th className="text-left py-3">Code</th>
                    <th className="text-left py-3">Name</th>
                    <th className="text-left py-3">Email</th>
                    <th className="text-left py-3">Department</th>
                    <th className="text-left py-3">Designation</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((emp) => (
                    <tr
                      key={emp.id}
                      className={`border-t ${
                        dark
                          ? "border-white/10"
                          : "border-gray-200"
                      }`}
                    >
                      <td className="py-4">{emp.id}</td>
                      <td>{emp.employee_code}</td>
                      <td>
                        {emp.first_name} {emp.last_name}
                      </td>
                      <td>{emp.email}</td>
                      <td>{getDepartmentName(emp.department_id)}</td>
                      <td>{emp.designation}</td>
                      <td>
                        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-sm">
                          {emp.employment_status}
                        </span>
                      </td>

                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditing(emp);

                              setForm({
                                employee_code:
                                  emp.employee_code,
                                first_name:
                                  emp.first_name,
                                last_name:
                                  emp.last_name,
                                email: emp.email,
                                department_id:
                                  emp.department_id,
                                designation:
                                  emp.designation,
                                employment_status:
                                  emp.employment_status,
                                date_of_joining:
                                  emp.date_of_joining,
                              });

                              setOpen(true);
                            }}
                            className="p-2 rounded-xl bg-blue-500 text-white"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(emp.id)
                            }
                            className="p-2 rounded-xl bg-red-500 text-white"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-8 opacity-70"
                      >
                        No employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white text-black w-full max-w-3xl rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-6">
              {editing
                ? "Edit Employee"
                : "Add Employee"}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Employee Code"
                value={form.employee_code}
                onChange={(e) =>
                  setForm({
                    ...form,
                    employee_code:
                      e.target.value,
                  })
                }
                className="border p-3 rounded-xl"
              />

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="border p-3 rounded-xl"
              />

              <input
                placeholder="First Name"
                value={form.first_name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    first_name:
                      e.target.value,
                  })
                }
                className="border p-3 rounded-xl"
              />

              <input
                placeholder="Last Name"
                value={form.last_name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    last_name:
                      e.target.value,
                  })
                }
                className="border p-3 rounded-xl"
              />

              <select
                value={form.department_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    department_id:
                      Number(
                        e.target.value
                      ),
                  })
                }
                className="border p-3 rounded-xl"
              >
                <option value={0}>
                  Select Department
                </option>

                {departments.map((d) => (
                  <option
                    key={d.id}
                    value={d.id}
                  >
                    {d.department_name} (ID:{" "}
                    {d.id})
                  </option>
                ))}
              </select>

              <input
                placeholder="Designation"
                value={form.designation}
                onChange={(e) =>
                  setForm({
                    ...form,
                    designation:
                      e.target.value,
                  })
                }
                className="border p-3 rounded-xl"
              />

              <select
                value={
                  form.employment_status
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    employment_status:
                      e.target.value,
                  })
                }
                className="border p-3 rounded-xl"
              >
                <option value="Active">
                  Active
                </option>
                <option value="Inactive">
                  Inactive
                </option>
              </select>

              <input
                type="date"
                value={
                  form.date_of_joining
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    date_of_joining:
                      e.target.value,
                  })
                }
                className="border p-3 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() =>
                  setOpen(false)
                }
                className="px-5 py-3 rounded-xl bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-5 py-3 rounded-xl bg-cyan-500 text-white"
              >
                Save Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
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