import DynamicDataPage from "@/features/mastersetting/components/DynamicDataPage";
import { useIdType } from "@/features/mastersetting/hooks/useIdType";
export const IdTypePage = () => {
  const { idType, isLoading, error, onCreate, onUpdate, onDelete } =
    useIdType(); // your hook
  return (
    <DynamicDataPage
      title="IdType"
      subtitle="Id Type of visiting."
      data={idType}
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
          placeholder: "Id Name",
        },
        {
          key: "description",
          label: "Description",
          required: true,
          placeholder: "Goverment Id Proff",
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
