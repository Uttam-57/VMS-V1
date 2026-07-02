import { useState } from "react";

export const ActionFormCard = ({ title, buttonText, onSubmit }) => {
  const [visitorId, setVisitorId] = useState("");

  const handleSubmit = () => {
    if (!visitorId.trim()) {
      alert("Please enter a valid Visitor ID.");
      return;
    }
    onSubmit && onSubmit(visitorId.trim());
    setVisitorId("");
  };

  const inputId = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div className="bg-white border border-slate-200 rounded-xl flex flex-col shadow-sm">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
        <h3 className="m-0 text-sm font-bold text-slate-700 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="p-6">
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-slate-600"
        >
          Visitor Id
        </label>
        <div className="flex gap-3 mt-2">
          <input
            type="text"
            id={inputId}
            name={inputId}
            placeholder="Enter ID..."
            value={visitorId}
            onChange={(e) => setVisitorId(e.target.value)}
            className="flex-1 h-11 border border-slate-300 rounded-lg px-3.5 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
          <button
            onClick={handleSubmit}
            className="h-11 px-6 rounded-lg bg-primary hover:bg-primary-hover text-white border-0 font-semibold text-sm cursor-pointer inline-flex items-center justify-center shadow-sm transition-colors"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};
