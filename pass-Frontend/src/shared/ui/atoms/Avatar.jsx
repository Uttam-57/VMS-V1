import { useState } from "react";
import { cn } from "@/shared/utils/cn";
export const Avatar = ({ src, alt, fallback, size = "md", className }) => {
  const [error, setError] = useState(false);
  const sizes = {
    sm: "avatar-sm",
    md: "avatar-md",
    lg: "avatar-lg",
  };
  return (
    <div
      className={cn(
        "avatar",
        sizes[size],
        className,
      )}
    >
      {src && !error ? (
        <img
          src={src}
          alt={alt}
          className="avatar-img"
          onError={() => setError(true)}
        />
      ) : (
        <span className="avatar-fallback">
          {fallback.substring(0, 2)}
        </span>
      )}
    </div>
  );
};
