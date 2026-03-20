import React from "react";
import { formatARS } from "./ExpensasConstants";

export default function ExpensasSaldo({ saldo, enRojo }) {
  return (
    <div
      className="relative overflow-hidden px-4 py-3 rounded-xl border"
      style={{
        background: enRojo ? "rgba(185,28,28,0.08)" : "rgba(91,158,160,0.06)",
        borderColor: enRojo ? "rgba(185,28,28,0.30)" : "rgba(91,158,160,0.18)",
      }}
    >
      {/* Barra lateral de acento */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
        style={{ background: enRojo ? "#b91c1c" : "#5b9ea0" }}
      />
      <p className="font-['Raleway'] text-[10px] font-semibold text-[#5b7a8a] m-0 mb-[6px] uppercase tracking-[0.07em]">
        Saldo pendiente
      </p>
      <p
        className="font-['Urbanist'] text-[16px] font-black m-0 leading-none"
        style={{ color: enRojo ? "#b91c1c" : "#2d3250" }}
      >
        {formatARS(saldo)}
      </p>
    </div>
  );
}