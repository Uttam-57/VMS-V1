import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/atoms/Input";
import { cn } from "@/shared/utils/cn";
export const SearchInput = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div className="search-input-wrapper">
      {
        <Search className="search-input-icon" />
      }
      {
        <Input
          type="search"
          placeholder="Search..."
          className={cn("search-input-field", className)}
          ref={ref}
          {...props}
        />
      }
    </div>
  );
});
SearchInput.displayName = "SearchInput";
