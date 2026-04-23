const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

/* -------------------------------- */
/* COMMON REQUEST HELPER            */
/* -------------------------------- */

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      ...options,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      let message = "Request failed";

      if (typeof data?.detail === "string") {
        message = data.detail;
      } else if (Array.isArray(data?.detail)) {
        message = data.detail[0]?.msg || "Validation error";
      } else if (data?.message) {
        message = data.message;
      }

      throw new Error(message);
    }

    return data;
  } catch (error: any) {
    console.error("API Request Error:", error);
    throw new Error(error.message || "Network error or server unavailable");
  }
}

/* -------------------------------- */
/* TYPES                            */
/* -------------------------------- */

export interface LoginPayload {
  email: string;
  password: string;
  role: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface LoggedInUser {
  name?: string;
  email: string;
  role: string;
  access_token?: string;
  token?: string;
}

export interface EmployeeForm {
  employee_code: string;
  first_name: string;
  last_name?: string;
  email: string;
  department_id: number;
  designation?: string;
  employment_status?: string;
  date_of_joining?: string;
}

type ApiEmployee = EmployeeForm & {
  employee_id: number;
  created_at?: string;
};

export interface Employee extends EmployeeForm {
  id: number;
  employee_id: number;
  created_at?: string;
}

type ApiDepartment = {
  department_id: number;
  department_name: string;
  created_at?: string;
};

export interface Department {
  id: number;
  department_id: number;
  department_name: string;
  created_at?: string;
}

export interface Asset {
  id: number;
  asset_id?: number;
  asset_name: string;
  asset_type?: string;
  purchase_date?: string;
  warranty_expiry_date?: string;
}

export interface AssignmentForm {
  asset_id: number;
  employee_id: number;
  assigned_date: string;
  expected_return_date: string;
  actual_return_date?: string;
  assignment_status: string;
}

export interface Assignment extends AssignmentForm {
  id: number;
}

export interface MaintenanceForm {
  asset_id: number;
  maintenance_date: string;
  description: string;
}

export interface Maintenance extends MaintenanceForm {
  id: number;
}

export interface RequestData {
  id: number;
  employee_id: number;
  asset_id: number;
  reason: string;
  status: string;
}

/* -------------------------------- */
/* NORMALIZERS                      */
/* -------------------------------- */

function normalizeEmployee(item: ApiEmployee): Employee {
  return {
    ...item,
    id: item.employee_id,
    employee_id: item.employee_id,
  };
}

function normalizeDepartment(item: ApiDepartment): Department {
  return {
    ...item,
    id: item.department_id,
    department_id: item.department_id,
  };
}

/* -------------------------------- */
/* AUTH                             */
/* -------------------------------- */

export async function loginUser(payload: LoginPayload): Promise<any> {
  return request(`${BASE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function signupUser(payload: SignupPayload): Promise<any> {
  return request(`${BASE_URL}/users/users`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logoutUser(): Promise<{ message: string }> {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }

  return { message: "Logged out successfully" };
}

/* -------------------------------- */
/* DASHBOARD                        */
/* -------------------------------- */

export async function getStats(): Promise<any> {
  return request(`${BASE_URL}/stats/`);
}

/* -------------------------------- */
/* EMPLOYEES                        */
/* -------------------------------- */

export async function getEmployees(): Promise<Employee[]> {
  const data = await request<ApiEmployee[]>(`${BASE_URL}/employees/`);
  return Array.isArray(data) ? data.map(normalizeEmployee) : [];
}

export async function getEmployeeById(id: number): Promise<Employee> {
  const data = await request<ApiEmployee>(`${BASE_URL}/employees/${id}`);
  return normalizeEmployee(data);
}

export async function createEmployee(
  payload: EmployeeForm
): Promise<Employee> {
  const data = await request<ApiEmployee>(`${BASE_URL}/employees/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return normalizeEmployee(data);
}

export async function updateEmployee(
  id: number,
  payload: Partial<EmployeeForm>
): Promise<Employee> {
  const data = await request<ApiEmployee>(`${BASE_URL}/employees/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return normalizeEmployee(data);
}

export async function deleteEmployee(
  id: number
): Promise<{ message: string }> {
  return request(`${BASE_URL}/employees/${id}`, {
    method: "DELETE",
  });
}

/* -------------------------------- */
/* DEPARTMENTS                      */
/* -------------------------------- */

export async function getDepartments(): Promise<Department[]> {
  const data = await request<ApiDepartment[]>(`${BASE_URL}/departments/`);
  return Array.isArray(data) ? data.map(normalizeDepartment) : [];
}

export async function createDepartment(payload: {
  department_name: string;
}): Promise<Department> {
  const data = await request<ApiDepartment>(`${BASE_URL}/departments/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return normalizeDepartment(data);
}

export async function deleteDepartment(
  id: number
): Promise<{ message: string }> {
  return request(`${BASE_URL}/departments/${id}`, {
    method: "DELETE",
  });
}

/* -------------------------------- */
/* ASSETS                           */
/* -------------------------------- */

export async function getAssets(): Promise<Asset[]> {
  return request(`${BASE_URL}/assets/`);
}

export async function createAsset(
  payload: Omit<Asset, "id">
): Promise<Asset> {
  return request(`${BASE_URL}/assets/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAsset(
  id: number,
  payload: Partial<Omit<Asset, "id">>
): Promise<Asset> {
  return request(`${BASE_URL}/assets/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteAsset(
  id: number
): Promise<{ message: string }> {
  return request(`${BASE_URL}/assets/${id}/`, {
    method: "DELETE",
  });
}

/* -------------------------------- */
/* ASSIGNMENTS                      */
/* -------------------------------- */

export async function getAssignments(): Promise<Assignment[]> {
  return request(`${BASE_URL}/assignments/`);
}

export async function createAssignment(
  payload: AssignmentForm
): Promise<Assignment> {
  return request(`${BASE_URL}/assignments/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAssignment(
  id: number,
  payload: Partial<AssignmentForm>
): Promise<Assignment> {
  return request(`${BASE_URL}/assignments/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteAssignment(
  id: number
): Promise<{ message: string }> {
  return request(`${BASE_URL}/assignments/${id}/`, {
    method: "DELETE",
  });
}

/* -------------------------------- */
/* MAINTENANCE                      */
/* -------------------------------- */

export async function getMaintenanceLogs(): Promise<Maintenance[]> {
  return request(`${BASE_URL}/maintenance/`);
}

export async function createMaintenanceLog(
  payload: MaintenanceForm
): Promise<Maintenance> {
  return request(`${BASE_URL}/maintenance/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateMaintenanceLog(
  id: number,
  payload: Partial<MaintenanceForm>
): Promise<Maintenance> {
  return request(`${BASE_URL}/maintenance/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteMaintenanceLog(
  id: number
): Promise<{ message: string }> {
  return request(`${BASE_URL}/maintenance/${id}/`, {
    method: "DELETE",
  });
}