import DynamicDataPage from "@/features/mastersetting/components/DynamicDataPage";
import { useDepartment } from "@/features/mastersetting/hooks/useDepartment";
export const DepartmentPage = () => {
  const { department, isLoading, error, onCreate, onUpdate, onDelete } =
    useDepartment();
  return (
    <DynamicDataPage
      title="Department"
      subtitle="Manage departments"
      data={department}
      idKey="_id"
      columns={[
        { key: "name", label: "Department Name", sortable: true },
        { key: "status", label: "Status", type: "status" },
      ]}
      isLoading={isLoading}
      error={error}
      onCreate={onCreate}
      onEdit={onUpdate}
      onDelete={onDelete}
      formFields={[
        {
          key: "name",
          label: "Department Name",
          required: true,
          placeholder: "Department",
        },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: ["active", "blocked", "deleted"],
          defaultValue: "active",
        },
      ]}
    />
  );
};
