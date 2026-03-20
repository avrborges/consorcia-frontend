import React from "react";
import { FiAlertCircle } from "react-icons/fi";

export default function ExpensasHeader({ vencidas }) {
  return (
    <div style={{ animation: "slideUp 0.35s cubic-bezier(0.22,1,0.36,1) both" }}>
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div>
          <p className="font-['Raleway'] text-[11px] font-semibold text-[#5b9ea0] m-0 mb-1 uppercase tracking-[0.1em]">
            Mis expensas
          </p>
          <h1 className="font-['Urbanist'] text-[24px] font-extrabold text-[#2d3250] m-0 leading-none">
            Historial de liquidaciones
          </h1>
        </div>

        {vencidas > 0 && (
          <div className="inline-flex items-center gap-[6px] px-3 py-[6px] rounded-[20px] bg-[rgba(185,28,28,0.08)] border border-[rgba(185,28,28,0.2)]">
            <FiAlertCircle size={12} color="#b91c1c" />
            <span className="font-['Raleway'] text-[11px] font-bold text-[#b91c1c]">
              {vencidas} vencida{vencidas > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}