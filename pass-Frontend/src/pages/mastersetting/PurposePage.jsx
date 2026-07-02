import DynamicDataPage from "@/features/mastersetting/components/DynamicDataPage";
import { usePurpose } from "@/features/mastersetting/hooks/usePurpose";
export const PurposePage = () => {
  const { purposes, isLoading, error, onCreate, onUpdate, onDelete } =
    usePurpose(); // your hook
  return (
    <DynamicDataPage
      title="Visiting Purpose"
      subtitle="Purpose of Visit"
      data={purposes}
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
          placeholder: "Purpose ",
        },
        {
          key: "description",
          label: "Description",
          required: true,
          placeholder: "Resone to visit",
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
