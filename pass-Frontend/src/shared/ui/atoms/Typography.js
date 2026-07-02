import React from "react";
import { cn } from "@/shared/utils/cn";
export const Typography = ({
  variant = "p",
  className,
  children,
  ...props
}) => {
  const variants = {
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
    h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
    h4: "scroll-m-20 text-xl font-semibold tracking-tight",
    p: "leading-7 [&:not(:first-child)]:mt-6",
    small: "text-sm font-medium leading-none",
    muted: "text-sm text-muted-foreground",
  };
  const Component = variant.startsWith("h")
    ? variant
    : variant === "p"
      ? "p"
      : variant === "small"
        ? "small"
        : "span";
  return React.createElement(
    Component,
    { className: cn(variants[variant], className), ...props },
    children,
  );
};
