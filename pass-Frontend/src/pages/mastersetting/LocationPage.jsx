import DynamicDataPage from "@/features/mastersetting/components/DynamicDataPage";
import { useLocation } from "@/features/mastersetting/hooks/useLocation";
export const LocationPage = () => {
  const { location, isLoading, error, onCreate, onUpdate, onDelete } =
    useLocation(); // your hook
  return (
    <DynamicDataPage
      title="Location"
      subtitle="Location of visiting."
      data={location}
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
          placeholder: "Location name",
        },
        {
          key: "description",
          label: "Description",
          required: true,
          placeholder: "Conforance room",
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
