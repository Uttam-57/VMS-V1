import DynamicDataPage from "@/features/mastersetting/components/DynamicDataPage";
import { useCarryWith } from "@/features/mastersetting/hooks/useCarryWith";
export const CarryWithPage = () => {
  const { carryWith, isLoading, error, onCreate, onUpdate, onDelete } =
    useCarryWith(); // your hook
  return (
    <DynamicDataPage
      title="Carry With"
      subtitle="Item to carry with while visiting."
      data={carryWith}
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
          placeholder: "Enter Item Name",
        },
        {
          key: "description",
          label: "Description",
          required: true,
          placeholder: "Tech tool",
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
