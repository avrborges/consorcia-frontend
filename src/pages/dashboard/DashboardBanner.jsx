import React from "react";

export default function DashboardBanner({ name, date }) {
  return (
    <div
      className="bg-white border border-[#b0cfd0] rounded-[14px] px-5 py-[14px] flex items-center justify-between gap-3 shadow-[0_2px_8px_rgba(45,50,80,0.06)] flex-wrap"
      style={{ animation: "fadeUp 0.35s cubic-bezier(0.22,1,0.36,1) both" }}
    >
      <div className="flex items-center gap-[10px] min-w-0 flex-wrap">
        <span className="font-['Raleway'] text-[14px] font-normal text-[#5b7a8a] whitespace-nowrap">
          {/* greeting viene del padre vía name */}
        </span>
        <span className="font-['Urbanist'] text-[16px] font-extrabold text-[#2d3250] whitespace-nowrap overflow-hidden text-ellipsis">
          {name}
        </span>
      </div>
      <div className="flex items-center gap-[5px] flex-shrink-0">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5b9ea0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8"  y1="2" x2="8"  y2="6" />
          <line x1="3"  y1="10" x2="21" y2="10" />
        </svg>
        <span className="font-['Raleway'] text-[12px] font-normal text-[#5b7a8a] whitespace-nowrap">{date}</span>
      </div>
    </div>
  );
}