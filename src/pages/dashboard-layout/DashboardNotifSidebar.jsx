import React from "react";
import { FiBell, FiX } from "react-icons/fi";
import { MOCK_NOTIFICACIONES } from "./DashboardConstants";

export default function DashboardNotifSidebar({ onClose }) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="lg:hidden fixed inset-0 z-40 bg-[rgba(26,31,62,0.55)] backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
      />

      {/* Sidebar */}
      <aside className="lg:hidden fixed inset-y-0 right-0 z-50 w-full bg-white flex flex-col shadow-[-4px_0_24px_rgba(45,50,80,0.12)] animate-[slideInRight_0.25s_cubic-bezier(0.4,0,0.2,1)]">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-[18px] bg-[#2d3250] border-b border-[rgba(255,255,255,0.06)] flex-shrink-0">
          <div className="flex items-center gap-2">
            <FiBell size={16} className="text-[#8ecfd1]" />
            <p className="font-['Raleway'] text-[15px] font-bold text-[#f0f4f8] m-0">Notificaciones</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar notificaciones"
            className="bg-transparent border-none p-[6px] cursor-pointer text-[rgba(240,244,248,0.5)] flex items-center justify-center touch-manipulation transition-colors duration-150 hover:text-[#f0f4f8]"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto">
          {MOCK_NOTIFICACIONES.map((n, i) => (
            <div
              key={i}
              className="flex items-start gap-[10px] p-4 border-b border-[rgba(176,207,208,0.3)] last:border-b-0 cursor-pointer transition-colors duration-150 hover:bg-[#f0f4f8]"
            >
              <span className="w-[9px] h-[9px] rounded-full flex-shrink-0 mt-1" style={{ background: n.dot }} />
              <div className="flex-1 min-w-0">
                <p className="font-['Raleway'] text-[14px] font-semibold text-[#2d3250] m-0 mb-[3px]">{n.title}</p>
                <p className="font-['Raleway'] text-[12px] text-[#5b7a8a] m-0">{n.desc}</p>
              </div>
              <p className="font-['Raleway'] text-[11px] text-[rgba(91,122,138,0.55)] m-0 flex-shrink-0">{n.time}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-[14px] border-t border-[rgba(176,207,208,0.3)]">
          <button className="bg-transparent border-none font-['Raleway'] text-[13px] font-semibold text-[#2a6b6e] cursor-pointer p-0 touch-manipulation w-full text-center transition-colors duration-150 hover:text-[#5b9ea0]">
            Ver todas →
          </button>
        </div>
      </aside>
    </>
  );
}