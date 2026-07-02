import { cn } from "@/shared/utils/cn";
export const Navbar = ({ className, children }) => {
  return (
    <header
      className={cn(
        "navbar",
        className,
      )}
    >
      {
        <div className="navbar-container">
          {children}
        </div>
      }
    </header>
  );
};
