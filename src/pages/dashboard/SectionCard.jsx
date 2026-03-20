import React from "react";

export function SectionCard({ children, delay = 0 }) {
  return (
    <div
      className="bg-white border border-[#b0cfd0] rounded-[14px] overflow-hidden shadow-[0_2px_8px_rgba(45,50,80,0.06)]"
      style={{ animation: `fadeUp 0.35s ${delay}s cubic-bezier(0.22,1,0.36,1) both` }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ icon: Icon, title, right }) {
  return (
    <div className="flex items-center justify-between px-5 py-[13px] border-b border-[rgba(176,207,208,0.4)]">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-[#5b9ea0]" />
        <span className="font-['Raleway'] text-[12px] font-semibold text-[#2d3250] tracking-[0.02em]">
          {title}
        </span>
      </div>
      {right && (
        <span className="font-['Raleway'] text-[11px] font-medium text-[#5b7a8a]">{right}</span>
      )}
    </div>
  );
}