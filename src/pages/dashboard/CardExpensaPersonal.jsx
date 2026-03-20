import React from "react";
import { FiDollarSign } from "react-icons/fi";
import { SectionCard, CardHeader } from "./SectionCard";
import { ESTADO_CONFIG } from "./DashboardConstants";

export default function CardExpensaPersonal({ navigate, expensa: expensaProp, data }) {
  const e      = expensaProp ?? data?.expensa;
  const estado = ESTADO_CONFIG[e.estado];
  const monto  = new Intl.NumberFormat("es-AR", {
    style: "currency", currency: "ARS", maximumFractionDigits: 0,
  }).format(e.monto);

  return (
    <SectionCard delay={0.1}>
      <CardHeader icon={FiDollarSign} title="Expensa del mes" right={e.periodo} />
      <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="font-['Urbanist'] text-[28px] font-extrabold text-[#2d3250] m-0 mb-1 leading-none">
            {monto}
          </p>
          <div className="flex items-center gap-[5px]">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#5b7a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="font-['Raleway'] text-[12px] text-[#5b7a8a]">Vence el {e.vencimiento}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-[10px]">
          <span
            className="inline-flex items-center gap-[5px] px-3 py-1 rounded-[20px] font-['Raleway'] text-[11px] font-bold tracking-[0.05em] uppercase"
            style={{ background: estado.bg, border: `1px solid ${estado.border}`, color: estado.color }}
          >
            <span className="w-[6px] h-[6px] rounded-full" style={{ background: estado.dot }} />
            {estado.label}
          </span>
          <button
            onClick={() => navigate("/expensas")}
            className="px-[14px] py-[7px] rounded-[10px] bg-[#2a6b6e] border-none font-['Raleway'] text-[12px] font-semibold text-white cursor-pointer touch-manipulation whitespace-nowrap flex-shrink-0 transition-colors duration-150 hover:bg-[#235b5e]"
          >
            Ver detalle →
          </button>
        </div>
      </div>
    </SectionCard>
  );
}