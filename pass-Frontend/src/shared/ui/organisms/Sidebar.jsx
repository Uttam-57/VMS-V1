import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export const Sidebar = ({ className, children }) => {
  return (
    <div className={cn("sidebar", className)}>
      <div className="sidebar-nav">{children}</div>
    </div>
  );
};

export const SidebarItem = ({ icon: Icon, label, isActive }) => {
  return (
    <div
      className={cn(
        "sidebar-item",
        isActive ? "sidebar-item-active" : "sidebar-item-inactive"
      )}
    >
      {Icon && <Icon className="sidebar-item-icon" />}
      {label}
    </div>
  );
};

export const SidebarGroup = ({ icon: Icon, label, isActive, children }) => {
  const [open, setOpen] = useState(isActive);

  // Keep open state synced when active route changes
  useEffect(() => {
    if (isActive) {
      setOpen(true);
    }
  }, [isActive]);

  return (
    <div>
      <div
        className={cn("sidebar-item", isActive ? "sidebar-item-active" : "sidebar-item-inactive")}
        onClick={() => setOpen((prev) => !prev)}
      >
        {Icon && <Icon className="sidebar-item-icon" />}
        <span className="flex-1">{label}</span>
        <ChevronDown
          className={cn("sidebar-item-icon transition-transform duration-200", open && "rotate-180")}
        />
      </div>

      {open && (
        <div className="sidebar-group-children">
          {children}
        </div>
      )}
    </div>
  );
};