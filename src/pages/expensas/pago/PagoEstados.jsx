import React from "react";
import { FiClock, FiAlertCircle, FiRefreshCw, FiCheckCircle } from "react-icons/fi";

/* ── Pendiente validación ── */
export function PagoPendienteValidacion() {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-6">
      <div className="w-16 h-16 rounded-full bg-[rgba(42,107,110,0.08)] border border-[rgba(42,107,110,0.2)] flex items-center justify-center">
        <FiClock size={28} className="text-[#2a6b6e]" />
      </div>
      <div>
        <p className="font-['Urbanist'] text-[16px] font-extrabold text-[#2d3250] m-0 mb-[6px]">
          Comprobante enviado
        </p>
        <p className="font-['Raleway'] font-light text-[13px] text-[#5b7a8a] m-0 leading-[1.6] max-w-[280px]">
          Tu pago quedó en estado <strong className="font-semibold text-[#2a6b6e]">Pendiente de validación</strong>. El administrador revisará el comprobante y actualizará el estado.
        </p>
      </div>
      <div className="w-full rounded-[12px] px-4 py-3 bg-[rgba(42,107,110,0.06)] border border-[rgba(42,107,110,0.15)]">
        <p className="font-['Raleway'] text-[12px] text-[#5b7a8a] m-0 leading-[1.5]">
          Tu saldo <strong className="font-semibold text-[#2d3250]">no se modificará</strong> hasta que el pago sea aprobado.
        </p>
      </div>
    </div>
  );
}

/* ── Comprobante rechazado ── */
export function PagoRechazado({ motivo, onReintentar }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-6">
      <div className="w-16 h-16 rounded-full bg-[rgba(185,28,28,0.07)] border border-[rgba(185,28,28,0.2)] flex items-center justify-center">
        <FiAlertCircle size={28} className="text-[#b91c1c]" />
      </div>
      <div>
        <p className="font-['Urbanist'] text-[16px] font-extrabold text-[#2d3250] m-0 mb-[6px]">
          Comprobante rechazado
        </p>
        <p className="font-['Raleway'] font-light text-[13px] text-[#5b7a8a] m-0 leading-[1.6]">
          El administrador rechazó el comprobante enviado.
        </p>
      </div>

      {/* Motivo */}
      {motivo && (
        <div className="w-full rounded-[12px] px-4 py-3 bg-[rgba(185,28,28,0.05)] border border-[rgba(185,28,28,0.18)] text-left">
          <p className="font-['Raleway'] text-[10px] font-bold text-[#b91c1c] m-0 mb-[4px] uppercase tracking-[0.07em]">
            Motivo del rechazo
          </p>
          <p className="font-['Raleway'] text-[13px] text-[#2d3250] m-0 leading-[1.5]">
            {motivo}
          </p>
        </div>
      )}

      {/* Reintentar */}
      <button
        type="button"
        onClick={onReintentar}
        className="
          w-full flex items-center justify-center gap-2
          py-[13px] rounded-xl border-none
          font-['Raleway'] text-[13px] font-bold tracking-[0.08em] text-white
          bg-[#2a6b6e] shadow-[0_4px_20px_rgba(42,107,110,0.25)]
          cursor-pointer touch-manipulation
          transition-all duration-[180ms]
          hover:bg-[#235b5e] hover:shadow-[0_6px_28px_rgba(42,107,110,0.40)] hover:-translate-y-px
          active:scale-[0.97]
        "
      >
        <FiRefreshCw size={14} />
        Reintentar
      </button>
    </div>
  );
}

/* ── Pago aprobado (estado final) ── */
export function PagoAprobado() {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-6">
      <div className="w-16 h-16 rounded-full bg-[rgba(42,107,110,0.08)] border border-[rgba(42,107,110,0.2)] flex items-center justify-center">
        <FiCheckCircle size={28} className="text-[#2a6b6e]" />
      </div>
      <div>
        <p className="font-['Urbanist'] text-[16px] font-extrabold text-[#2d3250] m-0 mb-[6px]">
          ¡Pago aprobado!
        </p>
        <p className="font-['Raleway'] font-light text-[13px] text-[#5b7a8a] m-0 leading-[1.6]">
          Tu pago fue verificado y aprobado. El saldo fue actualizado correctamente.
        </p>
      </div>
    </div>
  );
}