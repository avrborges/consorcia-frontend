import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getStoredUser } from "../../hooks/useLogin";
import { useDashboardData } from "../../hooks/useDashboardData";
import { getGreeting, getFormattedDate } from "./DashboardConstants";
import DashboardBanner from "./DashboardBanner";
import CardExpensaPersonal from "./CardExpensaPersonal";
import CardExpensaGlobal from "./CardExpensaGlobal";
import { CardMensajes, CardReclamos } from "./CardMensajesReclamos";
import { CardEncuesta, CardDocumentos } from "./CardEncuestaDocumentos";

export default function Dashboard() {
  const navigate       = useNavigate();
  const { consorcioId } = useOutletContext() ?? { consorcioId: "c1" };
  const storedUser     = getStoredUser();
  const name           = storedUser?.name  ?? "Usuario";
  const role           = storedUser?.role  ?? "owner";
  const userEmail      = storedUser?.email ?? "";
  const greeting       = useMemo(() => getGreeting(), []);
  const date           = useMemo(() => getFormattedDate(), []);

  const { data, unidades, loading } = useDashboardData(consorcioId, role, userEmail);

  const [unidadId, setUnidadId] = useState(null);
  useEffect(() => {
    if (unidades.length > 0) setUnidadId(unidades[0].id);
  }, [consorcioId, unidades]);

  const unidadActual          = unidades.find(u => u.id === unidadId) ?? unidades[0];
  const tieneMultipleUnidades = role === "owner" && unidades.length > 1;

  if (loading || !data) return null;

  const twoColGrid = "grid gap-4" + " " + "grid-cols-[repeat(auto-fit,minmax(260px,1fr))]";

  return (
    <div className="min-h-full font-['Raleway'] flex flex-col gap-4">
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      {/* Banner */}
      <div className="bg-white border border-[#b0cfd0] rounded-[14px] px-5 py-[14px] flex items-center justify-between gap-3 shadow-[0_2px_8px_rgba(45,50,80,0.06)] flex-wrap"
        style={{ animation: "fadeUp 0.35s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        <div className="flex items-center gap-[10px] min-w-0 flex-wrap">
          <span className="font-['Raleway'] text-[14px] font-normal text-[#5b7a8a] whitespace-nowrap">{greeting},</span>
          <span className="font-['Urbanist'] text-[16px] font-extrabold text-[#2d3250] whitespace-nowrap overflow-hidden text-ellipsis">{name}</span>
        </div>
        <div className="flex items-center gap-[5px] flex-shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5b9ea0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span className="font-['Raleway'] text-[12px] font-normal text-[#5b7a8a] whitespace-nowrap">{date}</span>
        </div>
      </div>

      {/* ── Owner ── */}
      {role === "owner" && <>
        {tieneMultipleUnidades && (
          <div
            className="bg-white border border-[#b0cfd0] rounded-[14px] px-4 py-3 shadow-[0_2px_8px_rgba(45,50,80,0.06)] flex items-center gap-3 flex-wrap"
            style={{ animation: "fadeUp 0.35s 0.05s cubic-bezier(0.22,1,0.36,1) both" }}
          >
            <span className="font-['Raleway'] text-[12px] font-semibold text-[#5b7a8a] whitespace-nowrap tracking-[0.03em]">Unidad:</span>
            <div className="flex gap-[6px] flex-wrap bg-[rgba(45,50,80,0.04)] rounded-[10px] p-1">
              {unidades.map(u => (
                <button
                  key={u.id}
                  onClick={() => setUnidadId(u.id)}
                  className={`
                    px-[14px] py-[6px] rounded-lg border-none
                    font-['Raleway'] text-[12px] font-semibold
                    cursor-pointer touch-manipulation whitespace-nowrap
                    transition-all duration-[180ms]
                    ${u.id === unidadId
                      ? "bg-[#2a6b6e] text-white shadow-[0_2px_8px_rgba(42,107,110,0.25)]"
                      : "bg-transparent text-[rgba(45,50,80,0.45)] hover:bg-[rgba(91,158,160,0.08)] hover:text-[#2a6b6e]"
                    }
                  `}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>
        )}
        <CardExpensaPersonal navigate={navigate} expensa={unidadActual?.expensa} data={data} />
        <div className={twoColGrid}>
          <CardReclamos navigate={navigate} delay={0.2}  data={data} />
          <CardMensajes navigate={navigate} delay={0.25} data={data} />
        </div>
        <div className={twoColGrid}>
          <CardEncuesta   navigate={navigate} delay={0.3}  data={data} />
          <CardDocumentos navigate={navigate} delay={0.35} data={data} />
        </div>
      </>}

      {/* ── Tenant ── */}
      {role === "tenant" && <>
        <CardExpensaPersonal navigate={navigate} data={data} />
        <CardMensajes navigate={navigate} delay={0.2} data={data} />
      </>}

      {/* ── Council ── */}
      {role === "council" && <>
        <CardExpensaGlobal   navigate={navigate} data={data} />
        <CardExpensaPersonal navigate={navigate} data={data} />
        <div className={twoColGrid}>
          <CardReclamos navigate={navigate} delay={0.2}  data={data} />
          <CardMensajes navigate={navigate} delay={0.25} data={data} />
        </div>
        <div className={twoColGrid}>
          <CardEncuesta   navigate={navigate} delay={0.3}  data={data} />
          <CardDocumentos navigate={navigate} delay={0.35} data={data} />
        </div>
      </>}

      {/* ── Admin ── */}
      {role === "admin" && <>
        <CardExpensaGlobal navigate={navigate} data={data} />
        <div className={twoColGrid}>
          <CardReclamos navigate={navigate} delay={0.2}  data={data} />
          <CardMensajes navigate={navigate} delay={0.25} data={data} />
        </div>
        <div className={twoColGrid}>
          <CardEncuesta   navigate={navigate} delay={0.3}  data={data} />
          <CardDocumentos navigate={navigate} delay={0.35} data={data} />
        </div>
      </>}

      <div className="h-4" />
    </div>
  );
}