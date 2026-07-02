import { cn } from "@/shared/utils/cn";
import { X } from "lucide-react";
export const Modal = ({ isOpen, onClose, title, children, className }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      {
        <div
          className="modal-backdrop"
          onClick={onClose}
        />
      }
      {
        <div
          className={cn(
            "modal-content",
            className,
          )}
        >
          {(title || onClose) && (
            <div className="modal-header">
              {title && (
                <h2 className="modal-title">
                  {title}
                </h2>
              )}
              {
                <button
                  onClick={onClose}
                  className="modal-close-btn"
                >
                  {<X className="modal-close-icon" />}
                  {<span className="sr-only">Close</span>}
                </button>
              }
            </div>
          )}
          {children}
        </div>
      }
    </div>
  );
};
