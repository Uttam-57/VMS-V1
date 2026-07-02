import React from "react";
import { cn } from "@/shared/utils/cn";

export const Label = React.forwardRef(({ className, htmlFor, ...props }, ref) => {
  const Component = htmlFor ? "label" : "span";
  return (
    <Component
      ref={ref}
      htmlFor={htmlFor}
      className={cn(
        "label",
        className,
      )}
      {...props}
    />
  );
});
Label.displayName = "Label";

