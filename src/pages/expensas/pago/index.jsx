import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useOutletContext } from "react-router-dom";
import { getStoredUser } from "../../../hooks/useLogin";
import { useExpensasData } from "../../../hooks/useExpensasData";
import PagoMonto from "./PagoMonto";
import PagoDatosBancarios from "./PagoDatosBancarios";
import PagoUploader from "./PagoUploader";
import { PagoPendienteValidacion, PagoRechazado } from "./PagoEstados";
import { STEPS } from "./PagoConstants";

export default function PagoPage() {
  const { id }         = useParams();
  const navigate       = useNavigate();
  const outletContext  = useOutletContext();
  const consorcioId    = outletContext?.consorcioId ?? "c1";
  const storedUser     = getStoredUser();
  const email          = storedUser?.email ?? "";

  const { historial, periodoToKey, ultimoPeriodoKey, loading, markAsPendienteValidacion } =
    useExpensasData(consorcioId, email);

  const [step,     setStep]     = useState(STEPS.INSTRUCCIONES);
  const [archivo,  setArchivo]  = useState(null);
  const [enviando, setEnviando] = useState(false);

  // Buscar la expensa por id
  const exp = historial.find((e) => String(e.id) === String(id));

  const handleEnviar = async () => {
    if (!archivo || enviando) return;
    setEnviando(true);
    // Mock — reemplazar por fetch a services/api.js
    await new Promise((r) => setTimeout(r, 1400));
    markAsPendienteValidacion(id);
    setEnviando(false);
    setStep(STEPS.PENDIENTE_VALIDACION);
  };

  const handleReintentar = () => {
    setArchivo(null);
    setStep(STEPS.UPLOAD);
  };

  if (loading) return null;

  if (!exp) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="font-['Raleway'] text-[15px] text-[#5b7a8a]">
          No se encontró la expensa.
        </p>
        <button
          onClick={() => navigate("/expensas")}
          className="font-['Raleway'] text-[13px] font-semibold text-[#2a6b6e] bg-transparent border-none cursor-pointer hover:text-[#5b9ea0] transition-colors duration-150"
        >
          ← Volver a expensas
        </button>
      </div>
    );
  }

  const itemsEfectivos = exp.items ?? [];
  const montoEfectivo  = itemsEfectivos.reduce((s, i) => s + i.monto, 0) || exp.monto;

  /* ─────────────────────────────────────────
     Columna izquierda — detalle de la expensa
  ───────────────────────────────────────── */
  const ColIzquierda = () => (
    <div className="flex flex-col gap-5">
      {/* Monto */}
      <PagoMonto monto={montoEfectivo} periodo={exp.periodo} estado={exp.estado} />

      {/* Desglose de conceptos */}
      {itemsEfectivos.length > 0 && (
        <div className="bg-white border border-[#b0cfd0] rounded-[14px] overflow-hidden">
          <div className="px-4 py-3 bg-[rgba(91,158,160,0.06)] border-b border-[rgba(176,207,208,0.4)]">
            <p className="font-['Raleway'] text-[11px] font-bold text-[#2a6b6e] m-0 uppercase tracking-[0.08em]">
              Detalle de la liquidación
            </p>
          </div>
          <div className="px-4 py-2">
            {itemsEfectivos.map((item, i) => {
              const pct = Math.round((item.monto / (montoEfectivo || 1)) * 100);
              return (
                <div
                  key={i}
                  className="flex items-center justify-between py-[9px] border-b border-[rgba(176,207,208,0.25)] last:border-b-0 gap-3"
                >
                  <span className="font-['Raleway'] text-[13px] text-[#2d3250] flex-1 min-w-0 truncate">
                    {item.concepto}
                  </span>
                  <span className="font-['Raleway'] text-[11px] font-semibold text-[#5b7a8a] bg-[rgba(91,158,160,0.08)] border border-[rgba(91,158,160,0.15)] px-2 py-[2px] rounded-full whitespace-nowrap">
                    {pct}%
                  </span>
                  <span className="font-['Urbanist'] text-[13px] font-bold text-[#2d3250] whitespace-nowrap">
                    {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(item.monto)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between px-4 py-3 bg-[rgba(42,107,110,0.06)] border-t border-[rgba(42,107,110,0.15)]">
            <span className="font-['Raleway'] text-[13px] font-bold text-[#2a6b6e]">Total</span>
            <span className="font-['Urbanist'] text-[18px] font-extrabold text-[#2a6b6e]">
              {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(montoEfectivo)}
            </span>
          </div>
        </div>
      )}

      {/* Aviso */}
      <div className="rounded-[12px] px-4 py-3 bg-[rgba(91,158,160,0.06)] border border-[rgba(91,158,160,0.18)]">
        <p className="font-['Raleway'] text-[12px] text-[#5b7a8a] m-0 leading-[1.6]">
          Tu saldo <strong className="font-semibold text-[#2d3250]">no se modificará</strong> hasta que el administrador apruebe el comprobante.
        </p>
      </div>
    </div>
  );

  /* ─────────────────────────────────────────
     Columna derecha — formulario / estados
  ───────────────────────────────────────── */
  const ColDerecha = () => (
    <div className="flex flex-col gap-5">

      {/* STEP: Instrucciones */}
      {step === STEPS.INSTRUCCIONES && (
        <>
          <PagoDatosBancarios />

          <div className="bg-white border border-[#b0cfd0] rounded-[14px] overflow-hidden">
            <div className="px-4 py-3 bg-[rgba(91,158,160,0.06)] border-b border-[rgba(176,207,208,0.4)]">
              <p className="font-['Raleway'] text-[11px] font-bold text-[#2a6b6e] m-0 uppercase tracking-[0.08em]">
                Cómo pagar
              </p>
            </div>
            <div className="px-4 py-4 flex flex-col gap-3">
              {[
                "Copiá el alias o CBU del consorcio con los botones de arriba.",
                "Realizá la transferencia desde tu banco por el monto exacto.",
                "Volvé aquí y subí el comprobante de pago.",
              ].map((texto, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[rgba(42,107,110,0.10)] border border-[rgba(42,107,110,0.2)] flex items-center justify-center font-['Urbanist'] text-[11px] font-extrabold text-[#2a6b6e] flex-shrink-0 mt-[1px]">
                    {i + 1}
                  </span>
                  <p className="font-['Raleway'] text-[13px] text-[#2d3250] m-0 leading-[1.5]">
                    {texto}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep(STEPS.UPLOAD)}
            className="
              w-full py-[13px] rounded-xl border-none
              font-['Raleway'] text-[13px] font-bold tracking-[0.08em] text-white
              bg-[#2a6b6e] shadow-[0_4px_20px_rgba(42,107,110,0.25)]
              cursor-pointer touch-manipulation
              transition-all duration-[180ms]
              hover:bg-[#235b5e] hover:shadow-[0_6px_28px_rgba(42,107,110,0.40)] hover:-translate-y-px
              active:scale-[0.97]
            "
          >
            Ya transferí — Subir comprobante
          </button>
        </>
      )}

      {/* STEP: Upload */}
      {step === STEPS.UPLOAD && (
        <div className="bg-white border border-[#b0cfd0] rounded-[14px] p-5">
          <PagoUploader
            archivo={archivo}
            onArchivoChange={setArchivo}
            enviando={enviando}
            onEnviar={handleEnviar}
          />
        </div>
      )}

      {/* STEP: Pendiente validación */}
      {step === STEPS.PENDIENTE_VALIDACION && (
        <div className="bg-white border border-[#b0cfd0] rounded-[14px] p-5">
          <PagoPendienteValidacion />
          <button
            type="button"
            onClick={() => navigate("/expensas")}
            className="
              w-full mt-4 py-[11px] rounded-xl border border-[#b0cfd0]
              font-['Raleway'] text-[13px] font-semibold text-[#5b7a8a]
              bg-transparent cursor-pointer touch-manipulation
              transition-all duration-150
              hover:border-[#5b9ea0] hover:text-[#2a6b6e] hover:bg-[rgba(91,158,160,0.04)]
            "
          >
            Volver a mis expensas
          </button>
        </div>
      )}

      {/* STEP: Rechazado */}
      {step === STEPS.RECHAZADO && (
        <div className="bg-white border border-[#b0cfd0] rounded-[14px] p-5">
          <PagoRechazado
            motivo={exp.motivoRechazo ?? null}
            onReintentar={handleReintentar}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-full font-['Raleway'] flex flex-col gap-5">
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{ animation: "fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both" }}>
        <button
          type="button"
          onClick={() => navigate("/expensas")}
          className="inline-flex items-center gap-2 bg-transparent border-none font-['Raleway'] text-[13px] font-semibold text-[#5b7a8a] cursor-pointer touch-manipulation mb-3 p-0 hover:text-[#2a6b6e] transition-colors duration-150"
        >
          <FiArrowLeft size={15} /> Volver a expensas
        </button>
        <div>
          <p className="font-['Raleway'] text-[11px] font-semibold text-[#5b9ea0] m-0 mb-1 uppercase tracking-[0.1em]">
            Pago de expensa
          </p>
          <h1 className="font-['Urbanist'] text-[24px] font-extrabold text-[#2d3250] m-0 leading-none">
            {exp.periodo}
            {exp.unidad && (
              <span className="font-['Raleway'] text-[14px] font-normal text-[#5b7a8a] ml-3">
                {exp.unidad}
              </span>
            )}
          </h1>
        </div>
      </div>

      {/* Two-column layout */}
      <div
        className="grid gap-5 items-start"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
          animation: "fadeUp 0.35s 0.08s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        <ColIzquierda />
        <ColDerecha />
      </div>

      <div className="h-4" />
    </div>
  );
}