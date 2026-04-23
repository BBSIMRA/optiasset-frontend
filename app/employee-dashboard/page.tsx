"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  CalendarDays,
  IdCard,
  LogOut,
  Mail,
  Moon,
  ShieldCheck,
  Sun,
  UserCircle2,
} from "lucide-react";

import {
  Department,
  Employee,
  getDepartments,
  getEmployees,
  logoutUser,
} from "@/lib/api";

type StoredUser = {
  name?: string;
  email?: string;
  role?: string;
  access_token?: string;
  token?: string;
};

export default function EmployeeDashboardPage() {
  const router = useRouter();

  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setDark(savedTheme !== "light");

    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/");
      return;
    }

    const parsedUser: StoredUser = JSON.parse(stored);
    setUser(parsedUser);

    loadEmployeeDashboard(parsedUser);
  }, [router]);

  async function loadEmployeeDashboard(loggedUser: StoredUser) {
    try {
      setLoading(true);
      setError("");

      const [employeesData, departmentsData] = await Promise.all([
        getEmployees(),
        getDepartments(),
      ]);

      setDepartments(departmentsData);

      const matchedEmployee =
        employeesData.find(
          (emp) =>
            emp.email?.toLowerCase() === loggedUser.email?.toLowerCase()
        ) || null;

      setEmployee(matchedEmployee);
    } catch (err: any) {
      setError(err.message || "Failed to load employee dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await logoutUser();
    localStorage.clear();
    window.location.href = "/";
  }

  const welcomeName = useMemo(() => {
    if (employee) {
      return `${employee.first_name || ""} ${employee.last_name || ""}`.trim();
    }

    if (user?.name) return user.name;
    if (user?.email) return user.email;

    return "Employee";
  }, [employee, user]);

  const departmentName = useMemo(() => {
    if (!employee) return "-";
    const found = departments.find(
      (dep) => dep.department_id === employee.department_id
    );
    return found?.department_name || `Department #${employee.department_id}`;
  }, [employee, departments]);

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        dark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-white"
          : "bg-gradient-to-br from-cyan-100 via-white to-blue-100 text-black"
      }`}
    >
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`w-72 m-4 rounded-3xl p-6 hidden md:block border backdrop-blur-2xl ${
            dark
              ? "bg-white/10 border-white/10"
              : "bg-white/70 border-white"
          }`}
        >
          <h1 className="text-3xl font-bold text-cyan-400 mb-10">
            OptiAsset
          </h1>

          <div className="space-y-3">
            <NavItem
              href="/employee-dashboard"
              label="Dashboard"
              active
            />
            <NavItem href="/my-assets" label="My Assets" />
            <NavItem href="/available-assets" label="Available Assets" />
            <NavItem href="/report-issue" label="Report Issue" />
            <NavItem href="/profile" label="Profile" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-500 text-left transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 p-4 md:p-6">
          {/* Header */}
          <div
            className={`rounded-3xl border backdrop-blur-2xl p-6 mb-8 flex justify-between items-center ${
              dark
                ? "bg-white/10 border-white/10"
                : "bg-white/70 border-white"
            }`}
          >
            <div>
              <h1 className="text-3xl font-bold">
                Welcome, {welcomeName}
              </h1>
              <p className="opacity-70 mt-1">
                Here is your employee profile and account information.
              </p>
            </div>

            <button
              onClick={() => {
                const nextDark = !dark;
                setDark(nextDark);
                localStorage.setItem("theme", nextDark ? "dark" : "light");
              }}
              className={`p-3 rounded-2xl border ${
                dark
                  ? "bg-white/10 border-white/10"
                  : "bg-white border-gray-300"
              }`}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Loading / Error / Empty */}
          {loading && (
            <SectionCard dark={dark}>
              <p className="opacity-80">Loading employee dashboard...</p>
            </SectionCard>
          )}

          {!loading && error && (
            <SectionCard dark={dark}>
              <p className="text-red-400">{error}</p>
            </SectionCard>
          )}

          {!loading && !error && !employee && (
            <SectionCard dark={dark}>
              <h2 className="text-2xl font-bold mb-2">Employee Profile</h2>
              <p className="opacity-80">
                No employee profile found for this account.
              </p>
              <p className="opacity-60 mt-2 text-sm">
                Please make sure the employee email created by admin matches the
                email used for login.
              </p>
            </SectionCard>
          )}

          {!loading && !error && employee && (
            <>
              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <InfoCard
                  dark={dark}
                  icon={<UserCircle2 size={20} />}
                  label="Employee Name"
                  value={`${employee.first_name || ""} ${employee.last_name || ""}`.trim() || "-"}
                />
                <InfoCard
                  dark={dark}
                  icon={<IdCard size={20} />}
                  label="Employee Code"
                  value={employee.employee_code || "-"}
                />
                <InfoCard
                  dark={dark}
                  icon={<Mail size={20} />}
                  label="Email"
                  value={employee.email || "-"}
                />
              </div>

              <SectionCard dark={dark}>
                <h2 className="text-2xl font-bold mb-6">Employee Profile</h2>

                <div className="grid md:grid-cols-2 gap-5">
                  <ProfileRow
                    icon={<IdCard size={18} />}
                    label="Employee Code"
                    value={employee.employee_code || "-"}
                  />
                  <ProfileRow
                    icon={<UserCircle2 size={18} />}
                    label="Name"
                    value={`${employee.first_name || ""} ${employee.last_name || ""}`.trim() || "-"}
                  />
                  <ProfileRow
                    icon={<Mail size={18} />}
                    label="Email"
                    value={employee.email || "-"}
                  />
                  <ProfileRow
                    icon={<Briefcase size={18} />}
                    label="Designation"
                    value={employee.designation || "-"}
                  />
                  <ProfileRow
                    icon={<Building2 size={18} />}
                    label="Department"
                    value={departmentName}
                  />
                  <ProfileRow
                    icon={<ShieldCheck size={18} />}
                    label="Employment Status"
                    value={employee.employment_status || "-"}
                  />
                  <ProfileRow
                    icon={<CalendarDays size={18} />}
                    label="Date of Joining"
                    value={employee.date_of_joining || "-"}
                  />
                </div>
              </SectionCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  dark,
  children,
}: {
  dark: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-3xl border backdrop-blur-2xl p-6 ${
        dark
          ? "bg-white/10 border-white/10"
          : "bg-white/70 border-white"
      }`}
    >
      {children}
    </div>
  );
}

function InfoCard({
  dark,
  icon,
  label,
  value,
}: {
  dark: boolean;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className={`rounded-3xl border backdrop-blur-2xl p-6 ${
        dark
          ? "bg-white/10 border-white/10"
          : "bg-white/70 border-white"
      }`}
    >
      <div className="flex items-center gap-3 mb-4 text-cyan-400">
        <div className="p-3 rounded-2xl bg-cyan-500/20">{icon}</div>
        <span className="font-semibold">{label}</span>
      </div>
      <p className="text-lg font-bold break-words">{value}</p>
    </div>
  );
}

function ProfileRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-black/10 border border-white/10 p-4">
      <div className="flex items-center gap-2 opacity-70 mb-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="font-semibold break-words">{value}</div>
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