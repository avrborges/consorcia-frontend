import React from "react";
import { FiPieChart, FiFileText, FiDownload } from "react-icons/fi";
import { SectionCard, CardHeader } from "./SectionCard";

export function CardEncuesta({ navigate, delay, data }) {
  const { titulo, vence, participantes } = data?.encuesta;
  return (
    <SectionCard delay={delay}>
      <CardHeader icon={FiPieChart} title="Encuesta activa" />
      <div className="px-5 py-[14px] flex items-center justify-between flex-wrap gap-3">
        <div className="min-w-0">
          <p className="font-['Raleway'] text-[13px] font-semibold text-[#2d3250] m-0 mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {titulo}
          </p>
          <p className="font-['Raleway'] text-[11px] text-[#5b7a8a] m-0">
            {participantes} respuestas · vence {vence}
          </p>
        </div>
        <button
          onClick={() => navigate("/encuestas")}
          className="px-[14px] py-[7px] rounded-[10px] bg-[#2a6b6e] border-none font-['Raleway'] text-[12px] font-semibold text-white cursor-pointer touch-manipulation whitespace-nowrap flex-shrink-0 transition-colors duration-150 hover:bg-[#235b5e]"
        >
          Participar →
        </button>
      </div>
    </SectionCard>
  );
}

export function CardDocumentos({ navigate, delay, data }) {
  return (
    <SectionCard delay={delay}>
      <CardHeader icon={FiFileText} title="Documentos recientes" />
      <div>
        {data?.documentos.map((doc, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-5 py-[11px]"
            style={{ borderBottom: i < data.documentos.length - 1 ? "1px solid rgba(176,207,208,0.3)" : "none" }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <FiFileText size={13} className="text-[#5b9ea0] flex-shrink-0" />
              <span className="font-['Raleway'] text-[13px] text-[#2d3250] overflow-hidden text-ellipsis whitespace-nowrap">
                {doc.nombre}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 ml-3">
              <span className="font-['Raleway'] text-[11px] text-[#5b7a8a]">{doc.fecha}</span>
              <button
                title="Descargar"
                className="bg-transparent border-none p-1 cursor-pointer text-[#5b9ea0] flex items-center touch-manipulation transition-colors duration-150 hover:text-[#2a6b6e]"
              >
                <FiDownload size={14} />
              </button>
            </div>
          </div>
        ))}
        <div className="px-5 py-[10px] border-t border-[rgba(176,207,208,0.3)]">
          <button
            onClick={() => navigate("/documentos")}
            className="bg-transparent border-none font-['Raleway'] text-[12px] font-semibold text-[#2a6b6e] cursor-pointer p-0 transition-colors duration-150 hover:text-[#5b9ea0]"
          >
            Ver todos →
          </button>
        </div>
      </div>
    </SectionCard>
  );
}