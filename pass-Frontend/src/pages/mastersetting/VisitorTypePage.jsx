import DynamicDataPage from "@/features/mastersetting/components/DynamicDataPage";
import { useVisitorType } from "@/features/mastersetting/hooks/useVisitorType";
export const VisitorTypePage = () => {
  const { visitorType, isLoading, error, onCreate, onUpdate, onDelete } =
    useVisitorType(); // your hook
  return (
    <DynamicDataPage
      title="Visitor Type"
      subtitle="Type Of Visitor"
      data={visitorType}
      idKey="_id"
      columns={[
        { key: "name", label: "Full Name", sortable: true },
        { key: "description", label: "Description" },
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
          label: "Item Name",
          required: true,
          placeholder: "Type Name",
        },
        {
          key: "description",
          label: "Description",
          required: true,
          placeholder: "Type of visitor",
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
