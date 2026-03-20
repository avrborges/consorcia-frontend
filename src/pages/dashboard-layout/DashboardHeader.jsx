import React, { useRef, useEffect } from "react";
import { FiBell, FiMenu } from "react-icons/fi";
import logoConsorcia from "../../assets/img/consorcia.png";
import { MOCK_NOTIFICACIONES } from "./DashboardConstants";

export default function DashboardHeader({
  user,
  collapsed, onToggleCollapse,
  onOpenDrawer,
  consorcioActual, consorciosUsuario, consorcioId, tieneMultipleConsorcios,
  consorcioOpen, onToggleConsorcio, onSelectConsorcio,
  notifOpen, onToggleNotif,
}) {
  const notifRef     = useRef(null);
  const consorcioRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) onToggleNotif(false);
      if (consorcioRef.current && !consorcioRef.current.contains(e.target)) onToggleConsorcio(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onToggleNotif, onToggleConsorcio]);

  return (
    <header className="h-[60px] flex-shrink-0 flex items-center justify-between px-4 bg-[#2d3250] border-b border-[rgba(255,255,255,0.06)] z-10 relative">

      {/* Izquierda: hamburguesa mobile / colapsar desktop */}
      <div className="flex items-center gap-[10px]">
        {/* Mobile */}
        <button
          onClick={onOpenDrawer}
          aria-label="Abrir menú"
          className="lg:hidden bg-transparent border-none p-1 cursor-pointer text-[rgba(240,244,248,0.7)] touch-manipulation transition-colors duration-150 hover:text-[#f0f4f8]"
        >
          <FiMenu size={22} />
        </button>
        {/* Desktop */}
        <button
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          className="hidden lg:flex bg-transparent border-none p-1 cursor-pointer text-[rgba(240,244,248,0.6)] touch-manipulation transition-colors duration-150 hover:text-[#f0f4f8]"
        >
          <FiMenu size={20} />
        </button>
      </div>

      {/* Centro: logo (tenant) o selector consorcio */}
      <div ref={consorcioRef} className="absolute left-1/2 -translate-x-1/2 z-20">
        {user.role === "tenant" ? (
          <div className="flex items-center gap-[7px]">
            <img src={logoConsorcia} alt="Logo" className="w-6 h-6" />
            <span className="font-['Urbanist'] font-extrabold text-[15px] text-[#f0f4f8] tracking-[0.12em]">
              CONSOR<span className="text-[#f9b17a]">CIA</span>
            </span>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => tieneMultipleConsorcios && onToggleConsorcio(v => !v)}
              className={`
                flex items-center gap-[6px] rounded-[10px]
                touch-manipulation transition-colors duration-150
                ${tieneMultipleConsorcios
                  ? "bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.10)] px-3 py-[5px] cursor-pointer hover:bg-[rgba(255,255,255,0.12)]"
                  : "bg-transparent border-none px-1 py-[5px] cursor-default"
                }
              `}
              aria-label="Seleccionar consorcio"
            >
              <div className="text-center">
                <p className="font-['Raleway'] text-[10px] font-light text-[rgba(240,244,248,0.35)] m-0 tracking-[0.04em] leading-none mb-[2px]">
                  Consorcio activo
                </p>
                <p className="font-['Urbanist'] text-[14px] font-extrabold text-[#f0f4f8] m-0 tracking-[0.06em] whitespace-nowrap">
                  {consorcioActual?.nombre}
                </p>
              </div>
              {tieneMultipleConsorcios && (
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(240,244,248,0.4)" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: consorcioOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              )}
            </button>

            {/* Dropdown consorcios */}
            {consorcioOpen && tieneMultipleConsorcios && (
              <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 min-w-[220px] rounded-xl bg-white border border-[#b0cfd0] shadow-[0_8px_24px_rgba(45,50,80,0.12)] z-50 overflow-hidden animate-[fadeIn_0.15s_ease]">
                <div className="px-4 py-[10px] pb-2 border-b border-[rgba(176,207,208,0.3)]">
                  <p className="font-['Raleway'] text-[11px] font-semibold text-[#5b7a8a] m-0 tracking-[0.04em]">
                    Mis consorcios
                  </p>
                </div>
                {consorciosUsuario.map(c => (
                  <div
                    key={c.id}
                    onClick={() => onSelectConsorcio(c.id)}
                    className={`relative flex flex-col px-4 py-[11px] cursor-pointer border-b border-[rgba(176,207,208,0.3)] last:border-b-0 transition-colors duration-150 hover:bg-[#f0f4f8] ${c.id === consorcioId ? "bg-[rgba(91,158,160,0.07)]" : ""}`}
                  >
                    <span className="font-['Raleway'] text-[13px] font-semibold text-[#2d3250]">{c.nombre}</span>
                    <span className="font-['Raleway'] text-[11px] text-[#5b7a8a] mt-[2px]">{c.direccion}</span>
                    {c.id === consorcioId && (
                      <span className="absolute right-[14px] top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-[#2a6b6e]" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Derecha: nombre usuario + notificaciones */}
      <div className="flex items-center gap-3">
        {/* Nombre — solo desktop */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2a6b6e] to-[#5b9ea0] flex items-center justify-center font-['Raleway'] text-[11px] font-bold text-white flex-shrink-0">
            {user.initials}
          </div>
          <span className="font-['Raleway'] text-[13px] font-medium text-[rgba(240,244,248,0.75)] whitespace-nowrap">
            {user.name}
          </span>
        </div>

        {/* Notificaciones */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => onToggleNotif(v => !v)}
            aria-label="Notificaciones"
            className="relative bg-transparent border-none p-[6px] cursor-pointer text-[rgba(240,244,248,0.7)] flex items-center justify-center touch-manipulation transition-colors duration-150 hover:text-[#f0f4f8]"
          >
            <FiBell size={22} />
            <span className="absolute top-[6px] right-[6px] w-[7px] h-[7px] rounded-full bg-[#f9b17a] border-[1.5px] border-[#2d3250]" />
          </button>

          {/* Panel notif desktop */}
          {notifOpen && (
            <div className="notif-panel-desktop hidden lg:block absolute top-[calc(100%+8px)] right-0 w-[300px] rounded-[14px] bg-white border border-[#b0cfd0] shadow-[0_8px_32px_rgba(45,50,80,0.12)] z-50 overflow-hidden animate-[fadeIn_0.15s_ease]">
              <div className="px-4 py-3 pb-[10px] border-b border-[rgba(176,207,208,0.3)]">
                <p className="font-['Raleway'] text-[12px] font-semibold text-[#2d3250] m-0">Notificaciones</p>
              </div>
              {MOCK_NOTIFICACIONES.map((n, i) => (
                <div key={i} className="flex items-start gap-[10px] px-4 py-3 border-b border-[rgba(176,207,208,0.3)] last:border-b-0 cursor-pointer transition-colors duration-150 hover:bg-[#f0f4f8]">
                  <span className="w-2 h-2 rounded-full flex-shrink-0 mt-[5px]" style={{ background: n.dot }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-['Raleway'] text-[12px] font-semibold text-[#2d3250] m-0 mb-[2px] truncate">{n.title}</p>
                    <p className="font-['Raleway'] text-[11px] text-[#5b7a8a] m-0 truncate">{n.desc}</p>
                  </div>
                  <p className="font-['Raleway'] text-[10px] text-[rgba(91,122,138,0.55)] m-0 flex-shrink-0">{n.time}</p>
                </div>
              ))}
              <div className="px-4 py-[10px]">
                <button className="bg-transparent border-none font-['Raleway'] text-[12px] font-semibold text-[#2a6b6e] cursor-pointer p-0 touch-manipulation transition-colors duration-150 hover:text-[#5b9ea0]">
                  Ver todas →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}