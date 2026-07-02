import React from "react";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/shared/utils/cn";
const icons = {
  default: <Info className="alert-icon" />,
  destructive: <XCircle className="alert-icon" />,
  success: <CheckCircle className="alert-icon" />,
  warning: <AlertCircle className="alert-icon" />,
};
export const Alert = React.forwardRef(
  ({ className, variant = "default", title, children, ...props }, ref) => {
    const variants = {
      default: "alert-default",
      destructive: "alert-destructive",
      success: "alert-success",
      warning: "alert-warning",
    };
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "alert",
          variants[variant],
          className,
        )}
        {...props}
      >
        {icons[variant]}
        {title && (
          <h5 className="alert-title">
            {title}
          </h5>
        )}
        {<div className="alert-content">{children}</div>}
      </div>
    );
  },
);
Alert.displayName = "Alert";
