import { cn } from "@/shared/utils/cn";

export const Footer = ({ className }) => {
  return (
    <footer className={cn("dashboard-footer", className)}>
      <div className="footer-left">
        <span className="footer-logo">VMS</span>
        <span className="footer-separator">•</span>
        <span>© {new Date().getFullYear()} Visitor Management System. All rights reserved.</span>
      </div>
      <div className="footer-links">
        <a href="#privacy" className="footer-link">Privacy Policy</a>
        <a href="#terms" className="footer-link">Terms of Service</a>
        <a href="#support" className="footer-link">Support Helpdesk</a>
        <div className="footer-status">
          <span className="footer-status-dot"></span>
          <span>VMS v1.0.0 • Connected</span>
        </div>
      </div>
    </footer>
  );
};
