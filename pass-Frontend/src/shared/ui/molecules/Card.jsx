import React from "react";
import { cn } from "@/shared/utils/cn";
export const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "card",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";
export const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("card-header", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";
export const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "card-title",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";
export const CardDescription = React.forwardRef(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("card-description", className)}
      {...props}
    />
  ),
);
CardDescription.displayName = "CardDescription";
export const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("card-content", className)} {...props} />
));
CardContent.displayName = "CardContent";
export const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("card-footer", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
