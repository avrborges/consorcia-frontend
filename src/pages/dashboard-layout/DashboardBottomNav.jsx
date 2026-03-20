import React from "react";
import { BOTTOM_ITEMS } from "./DashboardConstants";

export default function DashboardBottomNav({ isActive, onNavigate }) {
  return (
    <nav
      aria-label="Navegación principal"
      className="lg:hidden fixed bottom-0 left-0 right-0 h-[68px] flex bg-[#2d3250] border-t border-[rgba(255,255,255,0.07)] z-30"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {BOTTOM_ITEMS.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.path)}
          aria-label={item.label}
          className={`
            flex-1 flex flex-col items-center justify-center gap-1
            border-none bg-transparent cursor-pointer touch-manipulation p-0
            font-['Raleway'] text-[10px] font-semibold tracking-[0.03em]
            transition-colors duration-150 relative
            ${isActive(item.path) ? "text-[#8ecfd1]" : "text-[rgba(240,244,248,0.5)] hover:text-[rgba(240,244,248,0.75)]"}
          `}
        >
          {isActive(item.path) && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-[2px] rounded-b-[3px] bg-[#5b9ea0]" />
          )}
          <item.icon size={22} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}