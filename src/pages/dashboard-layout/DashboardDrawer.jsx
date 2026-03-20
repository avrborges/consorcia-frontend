import React from "react";
import { FiLogOut, FiX } from "react-icons/fi";
import { SIDEBAR_ITEMS, filterNavItems } from "./DashboardConstants";

export default function DashboardDrawer({ user, isActive, onNavigate, onLogout, onClose }) {
  const mainItems = filterNavItems(SIDEBAR_ITEMS, user.role).filter(i => i.id !== "configuracion");
  const sysItems  = filterNavItems(SIDEBAR_ITEMS, user.role).filter(i => i.id === "configuracion");

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-[rgba(26,31,62,0.55)] backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
      />

      {/* Drawer */}
      <aside className="fixed inset-y-0 left-0 z-50 w-full bg-[#edf2f4] flex flex-col animate-[slideIn_0.22s_cubic-bezier(0.4,0,0.2,1)]">

        {/* Header perfil */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => { onNavigate("/perfil"); onClose(); }}
          onKeyDown={e => e.key === "Enter" && (onNavigate("/perfil"), onClose())}
          aria-label="Ir a Mi Perfil"
          className="flex items-center justify-between px-4 pt-6 pb-5 bg-[#2d3250] border-b border-[rgba(255,255,255,0.06)] cursor-pointer touch-manipulation transition-colors duration-150 hover:bg-[#3a4060]"
        >
          <div className="flex items-center gap-[14px]">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2a6b6e] to-[#5b9ea0] flex items-center justify-center font-['Raleway'] text-[16px] font-bold text-white flex-shrink-0 shadow-[0_4px_14px_rgba(42,107,110,0.35)]">
              {user.initials}
            </div>
            <div className="min-w-0">
              <p className="font-['Raleway'] text-[15px] font-bold text-[#f0f4f8] m-0 truncate">{user.name}</p>
              <p className="font-['Raleway'] text-[11px] text-[rgba(240,244,248,0.4)] mt-[2px] mb-0 capitalize tracking-[0.03em]">{user.role}</p>
              <p className="font-['Raleway'] text-[12px] font-semibold text-[#8ecfd1] mt-1 mb-0 tracking-[0.01em]">Mi Perfil ›</p>
            </div>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onClose(); }}
            aria-label="Cerrar menú"
            className="bg-transparent border-none p-[6px] cursor-pointer text-[rgba(240,244,248,0.5)] flex items-center justify-center flex-shrink-0 touch-manipulation transition-colors duration-150 hover:text-[#f0f4f8]"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-[2px] overflow-y-auto">
          <p className="font-['Raleway'] text-[10px] font-semibold text-[rgba(45,50,80,0.3)] tracking-[0.12em] uppercase mx-1 mb-[10px] px-2">
            Principal
          </p>
          {mainItems.map(item => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.path); onClose(); }}
              className={`
                flex items-center gap-[10px] px-[14px] py-[11px] rounded-xl border-none
                font-['Raleway'] text-[14px] font-medium whitespace-nowrap overflow-hidden
                cursor-pointer touch-manipulation w-full
                transition-[background,color] duration-150
                ${isActive(item.path)
                  ? "bg-[rgba(91,158,160,0.12)] text-[#2a6b6e] border-l-2 border-[#5b9ea0] font-semibold pl-3"
                  : "bg-transparent text-[#2d3250] hover:bg-[rgba(45,50,80,0.06)]"
                }
              `}
            >
              <item.icon size={20} className="flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}

          <div className="mt-auto pt-2 border-t border-[rgba(45,50,80,0.08)]">
            <p className="font-['Raleway'] text-[10px] font-semibold text-[rgba(45,50,80,0.3)] tracking-[0.12em] uppercase mx-1 mb-[10px] px-2">
              Sistema
            </p>
            {sysItems.map(item => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.path); onClose(); }}
                className={`
                  flex items-center gap-[10px] px-[14px] py-[11px] rounded-xl border-none
                  font-['Raleway'] text-[14px] font-medium whitespace-nowrap overflow-hidden
                  cursor-pointer touch-manipulation w-full
                  transition-[background,color] duration-150
                  ${isActive(item.path)
                    ? "bg-[rgba(91,158,160,0.12)] text-[#2a6b6e] border-l-2 border-[#5b9ea0] font-semibold pl-3"
                    : "bg-transparent text-[#2d3250] hover:bg-[rgba(45,50,80,0.06)]"
                  }
                `}
              >
                <item.icon size={20} className="flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            ))}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-[14px] py-[11px] rounded-xl border-none font-['Raleway'] text-[14px] font-medium text-[rgba(45,50,80,0.45)] bg-transparent cursor-pointer touch-manipulation w-full transition-[background,color] duration-150 hover:bg-[rgba(185,28,28,0.07)] hover:text-[#b91c1c]"
            >
              <FiLogOut size={20} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}