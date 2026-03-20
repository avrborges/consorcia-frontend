import React from "react";
import { FiLogOut, FiMenu } from "react-icons/fi";
import logoConsorcia from "../../assets/img/consorcia.png";
import { SIDEBAR_ITEMS, APP_VERSION, filterNavItems } from "./DashboardConstants";

export default function DashboardSidebar({ collapsed, onToggle, role, isActive, onNavigate, onLogout }) {
  const mainItems = filterNavItems(SIDEBAR_ITEMS, role).filter(i => i.id !== "configuracion");
  const sysItems  = filterNavItems(SIDEBAR_ITEMS, role).filter(i => i.id === "configuracion");

  return (
    <aside
      className="sidebar-desktop hidden lg:flex flex-col bg-[#2d3250] border-r border-[rgba(255,255,255,0.06)] overflow-hidden relative z-20 flex-shrink-0"
      style={{ width: collapsed ? 64 : 220, transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)" }}
    >
      {/* Logo */}
      <div
        className="flex items-center border-b border-[rgba(255,255,255,0.06)] flex-shrink-0"
        style={{
          minHeight: 64,
          gap: collapsed ? 0 : 10,
          padding: collapsed ? "20px 0" : "20px 16px",
          justifyContent: collapsed ? "center" : "flex-start",
          transition: "padding 0.22s, gap 0.22s",
        }}
      >
        <img src={logoConsorcia} alt="Logo" className="w-[30px] h-[30px] flex-shrink-0" />
        {!collapsed && (
          <span className="font-['Urbanist'] font-extrabold text-[16px] text-[#f0f4f8] tracking-[0.15em] whitespace-nowrap">
            CONSOR<span className="text-[#f9b17a]">CIA</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 flex flex-col gap-[2px] overflow-y-auto">
        {!collapsed && (
          <p className="font-['Raleway'] text-[10px] font-semibold text-[rgba(240,244,248,0.2)] tracking-[0.12em] uppercase mx-1 mb-2 px-2">
            Principal
          </p>
        )}
        {mainItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.path)}
            title={collapsed ? item.label : undefined}
            className={`
              flex items-center gap-[10px] rounded-[10px] border-none
              font-['Raleway'] text-[13px] font-medium whitespace-nowrap overflow-hidden
              cursor-pointer touch-manipulation w-full
              transition-[background,color] duration-150
              ${isActive(item.path)
                ? "bg-[rgba(91,158,160,0.14)] text-[#8ecfd1] border-l-2 border-[#5b9ea0]"
                : "bg-transparent text-[rgba(240,244,248,0.55)] hover:bg-[rgba(255,255,255,0.07)] hover:text-[rgba(240,244,248,0.85)]"
              }
            `}
            style={{
              padding: collapsed ? "9px 0" : "9px 12px",
              justifyContent: collapsed ? "center" : "flex-start",
              paddingLeft: isActive(item.path) && !collapsed ? 10 : undefined,
            }}
          >
            <item.icon size={16} className="flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}

        {/* Sistema */}
        <div className="mt-auto pt-2 border-t border-[rgba(255,255,255,0.06)]">
          {!collapsed && (
            <p className="font-['Raleway'] text-[10px] font-semibold text-[rgba(240,244,248,0.2)] tracking-[0.12em] uppercase mx-1 mb-2 px-2">
              Sistema
            </p>
          )}
          {sysItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.path)}
              title={collapsed ? item.label : undefined}
              className={`
                flex items-center gap-[10px] rounded-[10px] border-none
                font-['Raleway'] text-[13px] font-medium whitespace-nowrap overflow-hidden
                cursor-pointer touch-manipulation w-full
                transition-[background,color] duration-150
                ${isActive(item.path)
                  ? "bg-[rgba(91,158,160,0.14)] text-[#8ecfd1] border-l-2 border-[#5b9ea0]"
                  : "bg-transparent text-[rgba(240,244,248,0.55)] hover:bg-[rgba(255,255,255,0.07)] hover:text-[rgba(240,244,248,0.85)]"
                }
              `}
              style={{
                padding: collapsed ? "9px 0" : "9px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
            >
              <item.icon size={16} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
          <button
            onClick={onLogout}
            title={collapsed ? "Cerrar sesión" : undefined}
            className="
              flex items-center gap-2 rounded-[10px] border-none
              font-['Raleway'] text-[13px] font-medium whitespace-nowrap overflow-hidden
              text-[rgba(240,244,248,0.3)] bg-transparent
              cursor-pointer touch-manipulation w-full
              transition-[background,color] duration-150
              hover:bg-[rgba(185,28,28,0.1)] hover:text-[#fca5a5]
            "
            style={{
              padding: collapsed ? "9px 0" : "9px 12px",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            <FiLogOut size={16} className="flex-shrink-0" />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </nav>

      {/* Version */}
      {!collapsed && (
        <div className="px-4 py-[10px] border-t border-[rgba(255,255,255,0.06)] font-['Raleway'] text-[10px] text-[rgba(240,244,248,0.15)] tracking-[0.08em] text-center">
          {APP_VERSION}
        </div>
      )}
    </aside>
  );
}