import React, { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";
import { DATOS_BANCARIOS } from "./PagoConstants";

function FilaDato({ label, value, copiable, onCopy, copiado }) {
  return (
    <div className="flex items-center justify-between gap-3 py-[10px] border-b border-[rgba(176,207,208,0.3)] last:border-b-0">
      <div className="min-w-0">
        <p className="font-['Raleway'] text-[10px] font-semibold text-[#5b7a8a] m-0 mb-[2px] uppercase tracking-[0.07em]">
          {label}
        </p>
        <p className="font-['Raleway'] text-[13px] font-semibold text-[#2d3250] m-0 break-all">
          {value}
        </p>
      </div>
      {copiable && (
        <button
          type="button"
          onClick={() => onCopy(value)}
          title={`Copiar ${label}`}
          className={`
            flex-shrink-0 flex items-center gap-[5px]
            px-[10px] py-[6px] rounded-[8px] border-none
            font-['Raleway'] text-[11px] font-semibold
            cursor-pointer touch-manipulation
            transition-all duration-200
            ${copiado
              ? "bg-[rgba(42,107,110,0.10)] text-[#2a6b6e]"
              : "bg-[rgba(91,158,160,0.08)] text-[#5b7a8a] hover:bg-[rgba(91,158,160,0.15)] hover:text-[#2a6b6e]"
            }
          `}
        >
          {copiado ? <FiCheck size={12} /> : <FiCopy size={12} />}
          {copiado ? "Copiado" : "Copiar"}
        </button>
      )}
    </div>
  );
}

export default function PagoDatosBancarios() {
  const [copiado, setCopiado] = useState(null); // "alias" | "cbu" | null

  const handleCopy = async (value, key) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiado(key);
      setTimeout(() => setCopiado(null), 2000);
    } catch {
      // fallback silencioso
    }
  };

  return (
    <div className="rounded-[14px] overflow-hidden border border-[#b0cfd0] bg-white">
      {/* Header */}
      <div className="px-4 py-3 bg-[rgba(91,158,160,0.06)] border-b border-[rgba(176,207,208,0.4)]">
        <p className="font-['Raleway'] text-[11px] font-bold text-[#2a6b6e] m-0 uppercase tracking-[0.08em]">
          Datos bancarios del consorcio
        </p>
      </div>

      {/* Filas */}
      <div className="px-4">
        <FilaDato label="Titular"   value={DATOS_BANCARIOS.titular} copiable={false} />
        <FilaDato label="Banco"     value={DATOS_BANCARIOS.banco}   copiable={false} />
        <FilaDato
          label="Alias"
          value={DATOS_BANCARIOS.alias}
          copiable
          copiado={copiado === "alias"}
          onCopy={(v) => handleCopy(v, "alias")}
        />
        <FilaDato
          label="CBU"
          value={DATOS_BANCARIOS.cbu}
          copiable
          copiado={copiado === "cbu"}
          onCopy={(v) => handleCopy(v, "cbu")}
        />
      </div>
    </div>
  );
}