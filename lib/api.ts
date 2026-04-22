const BASE_URL = "http://127.0.0.1:8001";

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
/* TYPE DEFINITIONS                 */
/* -------------------------------- */

/* FORM TYPE = used for create/edit forms */
export interface EmployeeForm {
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  department_id: number;
  designation: string;
  employment_status: string;
  date_of_joining: string;
}

/* DATABASE TYPE = includes id */
export interface Employee extends EmployeeForm {
  id: number;
}

export interface Department {
  id: number;
  department_name: string;
}

export interface Asset {
  id: number;
  asset_name: string;
  asset_type: string;
  purchase_date: string;
  warranty_expiry_date: string;
}

/* FORM TYPE */
export interface AssignmentForm {
  asset_id: number;
  employee_id: number;
  assigned_date: string;
  expected_return_date: string;
  actual_return_date?: string;
  assignment_status: string;
}

/* DATABASE TYPE */
export interface Assignment extends AssignmentForm {
  id: number;
}

/* FORM TYPE */
export interface MaintenanceForm {
  asset_id: number;
  maintenance_date: string;
  description: string;
}

/* DATABASE TYPE */
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
/* AUTH                             */
/* -------------------------------- */

export async function loginUser(payload: {
  email: string;
  password: string;
  role: string;
}): Promise<{ token: string }> {
  return request(`${BASE_URL}/api/login/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logoutUser(): Promise<{ message: string }> {
  return request(`${BASE_URL}/api/logout/`, {
    method: "POST",
  });
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
  return request(`${BASE_URL}/employees/`);
}

/* FIXED: use EmployeeForm instead of Employee */
export async function createEmployee(
  payload: EmployeeForm
): Promise<Employee> {
  return request(`${BASE_URL}/employees/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* FIXED */
export async function updateEmployee(
  id: number,
  payload: Partial<EmployeeForm>
): Promise<Employee> {
  return request(`${BASE_URL}/employees/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteEmployee(
  id: number
): Promise<{ message: string }> {
  return request(`${BASE_URL}/employees/${id}/`, {
    method: "DELETE",
  });
}

/* -------------------------------- */
/* DEPARTMENTS                      */
/* -------------------------------- */

export async function getDepartments(): Promise<Department[]> {
  return request(`${BASE_URL}/departments/`);
}

export async function createDepartment(payload: {
  department_name: string;
}): Promise<Department> {
  return request(`${BASE_URL}/departments/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteDepartment(
  id: number
): Promise<{ message: string }> {
  return request(`${BASE_URL}/departments/${id}/`, {
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