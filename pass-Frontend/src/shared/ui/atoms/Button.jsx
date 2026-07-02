import React from "react";
import { cn } from "@/shared/utils/cn";
export const Button = React.forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      outline: "btn-outline",
      ghost: "btn-ghost",
      danger: "btn-danger",
    };
    const sizes = {
      sm: "btn-sm",
      md: "btn-md",
      lg: "btn-lg",
      icon: "btn-icon",
    };

    React.useEffect(() => {
      if (size === "icon" && !props["aria-label"]) {
        console.warn(
          "Accessibility Warning: Button with size='icon' must have an 'aria-label' attribute.",
        );
      }
    }, [size, props["aria-label"]]);

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          "btn",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="btn-loading-icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            {
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
            }
            {
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            }
          </svg>
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
