# OptiAsset – Frontend Architecture & Component Mapping
Framework: Next.js

---

## Role: IT Administrator
(Full access to manage assets, departments, employees, and reports)

### Page: /dashboard
(Main landing page after login)

Component: <Sidebar />
- Navigation links: Dashboard, Departments, Assets, Employees, Reports

Component: <TopNavbar />
- Logged-in admin name
- Logout button

Component: <StatCards />
- Total Assets
- Assigned Assets
- Available Assets
- Broken Assets

Component: <RecentActivityTable />
- Recent asset assignments and returns

---

### Page: /departments
(Manage company departments)

Component: <Sidebar />

Component: <PageHeader />
- Title: Departments
- Add Department button

Component: <DepartmentsTable />
- List of departments
- Edit / Delete actions

Component: <AddDepartmentModal />
- Create new department

Component: <EditDepartmentModal />
- Update department details

---

### Page: /assets
(Manage all assets)

Component: <Sidebar />

Component: <PageHeader />
- Title: Assets
- Add Asset button

Component: <AssetsDataTable />
- Asset Code
- Type
- Status
- Assigned Employee
- Department
- Search and pagination

Component: <AddAssetModal />
- Add new asset

Component: <AssignAssetModal />
- Assign asset to employee

---

### Page: /employees
(Manage employees)

Component: <Sidebar />

Component: <PageHeader />
- Title: Employees
- Add Employee button

Component: <EmployeesTable />
- Employee details
- Department
- Designation

Component: <AddEmployeeModal />
- Create employee

Component: <EmployeeDetailsDrawer />
- Profile and assigned assets

---

### Page: /reports
(View analytics and reports)

Component: <Sidebar />

Component: <ReportsFilterPanel />
- Filter by department and date

Component: <AssetsStatusChart />
- Asset usage visualization

Component: <DownloadReportButton />
- Export CSV or PDF

---

## Role: Standard Employee
(Can view assigned assets only)

### Page: /my-assets
(Employee landing page)

Component: <TopNavbar />

Component: <MyAssetsList />
- Cards showing assigned assets

Component: <AssetStatusBadge />
- Assigned / Broken / Available

Component: <ReportIssueButton />
- Report asset issue

---

### Page: /my-profile
(Employee profile page)

Component: <TopNavbar />

Component: <ProfileDetailsCard />
- Name
- Email
- Department
- Designation

Component: <AssignedAssetsTable />
- List of assigned assets

---

## Shared Components
(Used across the app)

Component: <AuthGuard />
- Role-based route protection

Component: <LoadingSpinner />
- API loading state

Component: <ErrorBanner />
- Error handling

Component: <ConfirmationDialog />
- Delete confirmations