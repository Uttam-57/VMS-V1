import React from "react";
import { cn } from "@/shared/utils/cn";
export const Input = React.forwardRef(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "input",
          error && "input-error",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
