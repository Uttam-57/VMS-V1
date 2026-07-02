import { useMemo, useState, useEffect } from "react";
import DynamicDataPage from "@/features/mastersetting/components/DynamicDataPage";
import { useEmployees } from "@/features/mastersetting/hooks/useEmployee";
import { useDepartment } from "@/features/mastersetting/hooks/useDepartment";
import { getUsers } from "@/masterCalling/usermanagement/userManagementApi";

export const EmployeePage = () => {
  const { employees, isLoading, error, onCreate, onUpdate, onDelete } =
    useEmployees();
  const {
    department: departments,
    isLoading: departmentsLoading,
    error: departmentsError,
  } = useDepartment();

  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    getUsers()
      .then((res) => {
        if (res?.data?.data) {
          const approvers = res.data.data.filter(
            (u) => u.role !== "superadmin" && !u.isSecurity
          );
          setAvailableUsers(approvers);
        }
      })
      .catch(console.error);
  }, []);

  const departmentOptions = useMemo(() => {
    const fromMaster = departments
      .filter((d) => d.status === "active" || !d.status)
      .map((d) => d.name);
    const fromEmployees = employees.map((e) => e.department);
    return [...new Set([...fromMaster, ...fromEmployees].filter(Boolean))].sort(
      (a, b) => a.localeCompare(b),
    );
  }, [departments, employees]);

  const userOptions = useMemo(() => {
    return availableUsers.map((u) => ({
      value: u.id,
      label: u.name,
    }));
  }, [availableUsers]);

  const formFields = useMemo(
    () => [
      {
        key: "name",
        label: "Full Name",
        required: true,
        placeholder: "Jane Doe",
      },
      {
        key: "employeeId",
        label: "Employee ID",
        required: false,
        disabled: true,
        placeholder: "Auto-generated on Save",
      },
      {
        key: "department",
        label: "Department",
        type: "select",
        required: true,
        options: departmentOptions,
      },
      {
        key: "designation",
        label: "Designation",
        placeholder: "Senior Engineer",
      },
      {
        key: "email",
        label: "Email",
        type: "email",
        placeholder: "jane@company.com",
      },
      {
        key: "phone",
        label: "Phone",
        type: "tel",
        placeholder: "+1 555 000 0000",
      },
      {
        key: "approverIds",
        label: "Approving Users",
        type: "multi-select",
        options: userOptions,
      },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["active", "blocked", "deleted"],
        defaultValue: "active",
      },
    ],
    [departmentOptions, userOptions],
  );

  const userMap = useMemo(() => {
    const map = {};
    availableUsers.forEach((u) => {
      map[u.id] = u.name;
    });
    return map;
  }, [availableUsers]);

  const pageError =
    error ||
    departmentsError ||
    (!departmentsLoading && departmentOptions.length === 0
      ? "No departments found. Add departments under Settings → Department first."
      : null);

  return (
    <DynamicDataPage
      title="Employees"
      subtitle="Manage corporate profiles, roles, and authorization vectors."
      data={employees}
      idKey="_id"
      columns={[
        { key: "employeeId", label: "ID / Code", type: "mono", sortable: true },
        { key: "name", label: "Full Name", sortable: true },
        { key: "department", label: "Department", sortable: true },
        { key: "designation", label: "Designation" },
        { key: "email", label: "Email", type: "email" },
        {
          key: "approverIds",
          label: "Approving Users",
          render: (val) => {
            const list = Array.isArray(val) ? val : [];
            const names = list.map((id) => userMap[id] || id);
            return names.join(", ") || "—";
          },
        },
        { key: "status", label: "Status", type: "status" },
      ]}
      isLoading={isLoading || departmentsLoading}
      error={pageError}
      onCreate={onCreate}
      onEdit={onUpdate}
      onDelete={onDelete}
      isRowEditable={(row) => !row.user}
      isRowDeletable={(row) => !row.user}
      formFields={formFields}
    />
  );
};
