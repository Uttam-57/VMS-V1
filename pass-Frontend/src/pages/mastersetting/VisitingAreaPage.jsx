import DynamicDataPage from "@/features/mastersetting/components/DynamicDataPage";
import { useVisitorArea } from "@/features/mastersetting/hooks/useVisitorArea";
export const VisitorAreaPage = () => {
  const { visitorArea, isLoading, error, onCreate, onUpdate, onDelete } =
    useVisitorArea(); // your hook
  return (
    <DynamicDataPage
      title="Visiting Area"
      subtitle="Area to Visit"
      data={visitorArea}
      idKey="_id"
      columns={[
        { key: "name", label: "Full Name", sortable: true },
        { key: "floor", label: "Floor" },
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
          placeholder: "Area name",
        },
        {
          key: "description",
          label: "Description",
          required: true,
          placeholder: "Visiting area ",
        },
        {
          key: "floor",
          label: "Floor",
          placeholder: "Floor",
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
