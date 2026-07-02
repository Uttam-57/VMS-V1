import { cn } from "@/shared/utils/cn";
export const Badge = ({ className, variant = "default", ...props }) => {
  const variants = {
    default: "badge-default",
    secondary: "badge-secondary",
    destructive: "badge-destructive",
    outline: "badge-outline",
  };
  return (
    <div
      className={cn(
        "badge",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
};
