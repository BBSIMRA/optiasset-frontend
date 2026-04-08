const BASE_URL = "http://127.0.0.1:8000"

export async function getStats() {
  try {
    const res = await fetch(`${BASE_URL}/stats`)
    const data = await res.json()

    console.log("API DATA:", data) // 👈 ADD THIS

    return data
  } catch (error) {
    console.error("FETCH ERROR:", error)
    return null
  }
}

export async function getAssets() {
  try {
    const res = await fetch(`${BASE_URL}/api/assets`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error("FETCH ERROR:", error)
    return null
  }
}

export async function createAsset(assetData: any) {
  try {
    const res = await fetch(`${BASE_URL}/api/assets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assetData),
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error("FETCH ERROR:", error)
    return null
  }
}

export async function updateAsset(assetId: number, assetData: any) {
  try {
    const res = await fetch(`${BASE_URL}/api/assets/${assetId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assetData),
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error("FETCH ERROR:", error)
    return null
  }
}

export async function deleteAsset(assetId: number) {
  try {
    const res = await fetch(`${BASE_URL}/api/assets/${assetId}`, {
      method: "DELETE",
    })
    if (res.ok) {
      return { message: "Asset deleted" }
    }
    return null
  } catch (error) {
    console.error("FETCH ERROR:", error)
    return null
  }
}

export async function getDepartments() {
  try {
    const res = await fetch(`${BASE_URL}/api/departments`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error("FETCH ERROR:", error)
    return null
  }
}

export async function createDepartment(departmentData: any) {
  try {
    const res = await fetch(`${BASE_URL}/api/departments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(departmentData),
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error("FETCH ERROR:", error)
    return null
  }
}

export async function updateDepartment(departmentId: number, departmentData: any) {
  try {
    const res = await fetch(`${BASE_URL}/api/departments/${departmentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(departmentData),
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error("FETCH ERROR:", error)
    return null
  }
}

export async function deleteDepartment(departmentId: number) {
  try {
    const res = await fetch(`${BASE_URL}/api/departments/${departmentId}`, {
      method: "DELETE",
    })
    if (res.ok) {
      return { message: "Department deleted" }
    }
    return null
  } catch (error) {
    console.error("FETCH ERROR:", error)
    return null
  }
}

export async function getEmployees() {
  try {
    const res = await fetch(`${BASE_URL}/api/employees`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error("FETCH ERROR:", error)
    return null
  }
}

export async function createEmployee(employeeData: any) {
  try {
    const res = await fetch(`${BASE_URL}/api/employees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error("FETCH ERROR:", error)
    return null
  }
}

export async function updateEmployee(employeeId: number, employeeData: any) {
  try {
    const res = await fetch(`${BASE_URL}/api/employees/${employeeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error("FETCH ERROR:", error)
    return null
  }
}

export async function deleteEmployee(employeeId: number) {
  try {
    const res = await fetch(`${BASE_URL}/api/employees/${employeeId}`, {
      method: "DELETE",
    })
    if (res.ok) {
      return { message: "Employee deleted" }
    }
    return null
  } catch (error) {
    console.error("FETCH ERROR:", error)
    return null
  }
}

export async function deactivateEmployee(employeeId: number) {
  try {
    const res = await fetch(`${BASE_URL}/api/employees/${employeeId}/status`, {
      method: "PATCH",
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error("FETCH ERROR:", error)
    return null
  }
}

export async function getAssignments() {
  try {
    const res = await fetch(`${BASE_URL}/api/assignments`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error("FETCH ERROR:", error)
    return null
  }
}

export async function createAssignment(assignmentData: any) {
  try {
    const res = await fetch(`${BASE_URL}/api/assignments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assignmentData),
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error("FETCH ERROR:", error)
    return null
  }
}

export async function updateAssignment(assignmentId: number, assignmentData: any) {
  try {
    const res = await fetch(`${BASE_URL}/api/assignments/${assignmentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assignmentData),
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error("FETCH ERROR:", error)
    return null
  }
}

export async function deleteAssignment(assignmentId: number) {
  try {
    const res = await fetch(`${BASE_URL}/api/assignments/${assignmentId}`, {
      method: "DELETE",
    })
    if (res.ok) {
      return { message: "Assignment deleted" }
    }
    return null
  } catch (error) {
    console.error("FETCH ERROR:", error)
    return null
  }
}

export async function getMaintenance() {
  try {
    const res = await fetch(`${BASE_URL}/api/maintenance`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error("FETCH ERROR:", error)
    return null
  }
}

export async function createMaintenance(maintenanceData: any) {
  try {
    const res = await fetch(`${BASE_URL}/api/maintenance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(maintenanceData),
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error("FETCH ERROR:", error)
    return null
  }
}

export async function updateMaintenance(maintenanceId: number, maintenanceData: any) {
  try {
    const res = await fetch(`${BASE_URL}/api/maintenance/${maintenanceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(maintenanceData),
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error("FETCH ERROR:", error)
    return null
  }
}

export async function deleteMaintenance(maintenanceId: number) {
  try {
    const res = await fetch(`${BASE_URL}/api/maintenance/${maintenanceId}`, {
      method: "DELETE",
    })
    if (res.ok) {
      return { message: "Maintenance log deleted" }
    }
    return null
  } catch (error) {
    console.error("FETCH ERROR:", error)
    return null
  }
}