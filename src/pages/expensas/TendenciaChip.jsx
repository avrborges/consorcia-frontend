import React from "react";

export default function TendenciaChip({ tendencia }) {
  if (tendencia === null || tendencia === 0) return null;
  const sube = tendencia > 0;
  return (
    <span
      className={`
        inline-flex items-center gap-[3px]
        px-[7px] py-[2px] rounded-[20px]
        font-['Raleway'] text-[9px] font-bold
        ${sube
          ? "bg-[rgba(185,28,28,0.07)] border border-[rgba(185,28,28,0.2)] text-[#b91c1c]"
          : "bg-[rgba(42,107,110,0.08)] border border-[rgba(42,107,110,0.2)] text-[#2a6b6e]"
        }
      `}
    >
      {sube ? "↑" : "↓"} {Math.abs(tendencia)}%
    </span>
  );
}