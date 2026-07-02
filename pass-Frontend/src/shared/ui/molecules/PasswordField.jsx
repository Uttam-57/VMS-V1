import React, { useState } from "react";
import { Input } from "@/shared/ui/atoms/Input";
import { cn } from "@/shared/utils/cn";
import { Eye, EyeOff } from "lucide-react";
export const PasswordField = React.forwardRef(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
      <div className="password-field-wrapper">
        {
          <Input
            type={showPassword ? "text" : "password"}
            className={cn("password-field-input", className)}
            ref={ref}
            {...props}
          />
        }
        {
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="password-field-btn"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      </div>
    );
  },
);
PasswordField.displayName = "PasswordField";
