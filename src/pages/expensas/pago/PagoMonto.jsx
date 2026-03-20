import React from "react";

const formatARS = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency", currency: "ARS", maximumFractionDigits: 0,
  }).format(n);

export default function PagoMonto({ monto, periodo, estado }) {
  const esVencido = estado === "vencido";

  return (
    <div
      className="rounded-[14px] px-5 py-4 flex items-center justify-between gap-4"
      style={{
        background: esVencido ? "rgba(185,28,28,0.06)" : "rgba(42,107,110,0.07)",
        border: `1px solid ${esVencido ? "rgba(185,28,28,0.18)" : "rgba(42,107,110,0.18)"}`,
      }}
    >
      <div>
        <p className="font-['Raleway'] text-[11px] font-semibold text-[#5b7a8a] m-0 mb-1 uppercase tracking-[0.07em]">
          Monto a pagar
        </p>
        <p
          className="font-['Urbanist'] text-[28px] font-extrabold m-0 leading-none"
          style={{ color: esVencido ? "#b91c1c" : "#2a6b6e" }}
        >
          {formatARS(monto)}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-['Raleway'] text-[11px] font-semibold text-[#5b7a8a] m-0 mb-1 uppercase tracking-[0.07em]">
          Período
        </p>
        <p className="font-['Urbanist'] text-[15px] font-extrabold text-[#2d3250] m-0">
          {periodo}
        </p>
        {esVencido && (
          <span className="inline-flex items-center gap-1 mt-1 px-2 py-[2px] rounded-full bg-[rgba(185,28,28,0.08)] border border-[rgba(185,28,28,0.2)] font-['Raleway'] text-[10px] font-bold text-[#b91c1c] uppercase tracking-[0.05em]">
            Vencida
          </span>
        )}
      </div>
    </div>
  );
}