import React from "react";
import { FiDollarSign } from "react-icons/fi";
import { SectionCard, CardHeader } from "./SectionCard";

const STATS = [
  { label: "Pagas",      key: "pagas",      color: "#2a6b6e" },
  { label: "Pendientes", key: "pendientes", color: "#c87941" },
  { label: "Vencidas",   key: "vencidas",   color: "#b91c1c" },
];

export default function CardExpensaGlobal({ navigate, data }) {
  const e     = data?.expensa;
  const total = e.pagas + e.pendientes + e.vencidas;
  const pct   = Math.round((e.pagas / total) * 100);

  return (
    <SectionCard delay={0.1}>
      <CardHeader icon={FiDollarSign} title="Expensas — resumen global" right={e.periodo} />
      <div className="px-5 py-4">
        {/* Barra de progreso */}
        <div className="flex gap-[2px] rounded-[6px] overflow-hidden h-2 mb-[14px]">
          <div className="bg-[#2a6b6e] transition-[width_0.5s]" style={{ width: `${(e.pagas / total) * 100}%` }} />
          <div className="bg-[#f9b17a] transition-[width_0.5s]" style={{ width: `${(e.pendientes / total) * 100}%` }} />
          <div className="bg-[#b91c1c] transition-[width_0.5s]" style={{ width: `${(e.vencidas / total) * 100}%` }} />
        </div>

        {/* Leyenda */}
        <div className="flex gap-4 flex-wrap mb-[14px]">
          {STATS.map(s => (
            <div key={s.label} className="flex items-center gap-[6px]">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
              <span className="font-['Raleway'] text-[12px] text-[#5b7a8a]">{s.label}:</span>
              <span className="font-['Urbanist'] text-[13px] font-bold" style={{ color: s.color }}>{e[s.key]}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="font-['Raleway'] text-[12px] text-[#5b7a8a]">
            {pct}% cobrado de {total} unidades
          </span>
          <button
            onClick={() => navigate("/expensas")}
            className="px-[14px] py-[7px] rounded-[10px] bg-[#2a6b6e] border-none font-['Raleway'] text-[12px] font-semibold text-white cursor-pointer touch-manipulation whitespace-nowrap transition-colors duration-150 hover:bg-[#235b5e]"
          >
            Ver detalle →
          </button>
        </div>
      </div>
    </SectionCard>
  );
}