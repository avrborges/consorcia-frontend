import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiDownload, FiChevronDown, FiChevronUp,
  FiAlertCircle, FiCreditCard,
} from "react-icons/fi";
import TendenciaChip from "./TendenciaChip";
import { ESTADO, ITEM_COLORS, formatARS } from "./ExpensasConstants";

/* ── Badge de estado compartido ── */
function EstadoBadge({ est }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-[9px] py-[2px] rounded-[20px] font-['Raleway'] text-[9px] font-bold uppercase tracking-[0.06em]"
      style={{ background: est.bg, border: `1px solid ${est.border}`, color: est.color }}
    >
      <span className="w-[5px] h-[5px] rounded-full" style={{ background: est.dot }} />
      {est.label}
    </span>
  );
}

/* ── Botón descargar ── */
function BtnDescargar({ loading, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`
        inline-flex items-center gap-[5px]
        px-[13px] py-[7px] rounded-[9px]
        border border-[#b0cfd0] bg-transparent
        font-['Raleway'] text-[11px] font-semibold text-[#5b7a8a]
        cursor-pointer touch-manipulation
        transition-all duration-150
        hover:border-[#5b9ea0] hover:text-[#2a6b6e] hover:bg-[rgba(91,158,160,0.05)]
        disabled:opacity-70
      `}
    >
      {loading ? (
        <>
          <span className="w-[11px] h-[11px] rounded-full border-2 border-[rgba(91,122,138,0.3)] border-t-[#5b7a8a] animate-spin inline-block" />
          Descargando...
        </>
      ) : (
        <><FiDownload size={12} /> Descargar</>
      )}
    </button>
  );
}

export default function FilaExpensa({
  exp,
  defaultOpen = false,
  index = 0,
  isUltimoMes = false,
  onPaid,
  tendencia = null,
  itemMorosidad = null,
}) {
  const navigate = useNavigate();
  const [open, setOpen]               = useState(defaultOpen);
  const [descargando, setDescargando] = useState({});

  const panelId = `exp-panel-${exp.id}`;
  const est     = ESTADO[exp.estado] ?? ESTADO.pendiente;
  const EstIcon = est.Icon;

  const itemsEfectivos = itemMorosidad ? [...exp.items, itemMorosidad] : exp.items;
  const montoEfectivo  = itemsEfectivos.reduce((s, i) => s + i.monto, 0);
  const esPagable      = isUltimoMes && (exp.estado === "pendiente" || exp.estado === "vencido");

  const handleDescargar = () => {
    if (descargando["dl"]) return;
    setDescargando({ dl: true });
    setTimeout(() => setDescargando({}), 1800);
  };

  /* ── Ícono de estado ── */
  const EstadoIcon = (
    <div
      className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center"
      style={{ background: est.bg, border: `1px solid ${est.border}` }}
    >
      <EstIcon size={19} color={est.color} />
    </div>
  );

  /* ──────────── COMPACTA (meses anteriores) ──────────── */
  if (!isUltimoMes) {
    return (
      <div
        className="rounded-[16px] overflow-hidden bg-white border border-[#b0cfd0] shadow-[0_1px_4px_rgba(45,50,80,0.05)]"
        style={{ animation: `slideUp 0.35s ${index * 0.07}s cubic-bezier(0.22,1,0.36,1) both` }}
      >
        <div className="px-5 py-4 flex items-center justify-between gap-[14px]">
          <div className="flex items-center gap-[14px] min-w-0 flex-1">
            {EstadoIcon}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-[3px]">
                <span className="font-['Urbanist'] text-[15px] font-extrabold text-[#2d3250] leading-none">
                  {exp.periodo}
                </span>
                <EstadoBadge est={est} />
                <TendenciaChip tendencia={tendencia} />
              </div>
              {exp.fechaPago && (
                <p className="font-['Raleway'] text-[11px] text-[#2a6b6e] m-0">
                  Abonado el {exp.fechaPago}
                </p>
              )}
            </div>
          </div>
          <span className="font-['Urbanist'] text-[16px] font-extrabold text-[#2d3250] flex-shrink-0">
            {formatARS(exp.monto)}
          </span>
        </div>

        <div className="px-5 pb-4 flex justify-end border-t border-[rgba(176,207,208,0.35)]">
          <div className="pt-3">
            <BtnDescargar loading={!!descargando["dl"]} onClick={handleDescargar} />
          </div>
        </div>
      </div>
    );
  }

  /* ──────────── EXPANDIBLE (último mes) ──────────── */
  return (
    <div
      className="rounded-[16px] overflow-hidden bg-white transition-[box-shadow,border-color] duration-[250ms]"
      style={{
        border: `1px solid ${open ? est.border : "#b0cfd0"}`,
        boxShadow: open ? `0 6px 28px rgba(45,50,80,0.10), 0 0 0 1px ${est.border}` : "0 1px 4px rgba(45,50,80,0.05)",
        animation: `slideUp 0.35s ${index * 0.07}s cubic-bezier(0.22,1,0.36,1) both`,
      }}
    >
      {/* Header clickeable */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full bg-transparent border-none cursor-pointer px-5 py-4 flex items-center justify-between gap-[14px] text-left touch-manipulation"
      >
        <div className="flex items-center gap-[14px] min-w-0 flex-1">
          {EstadoIcon}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-['Urbanist'] text-[15px] font-extrabold text-[#2d3250] leading-none">
                {exp.periodo}
              </span>
              <EstadoBadge est={est} />
              <TendenciaChip tendencia={tendencia} />
            </div>
            <p className="font-['Raleway'] text-[11px] text-[#5b7a8a] m-0">
              {exp.unidad} · Vto. 1: {exp.vencimiento1} · Vto. 2: {exp.vencimiento2}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-[10px] flex-shrink-0">
          <span className="font-['Urbanist'] text-[16px] font-extrabold text-[#2d3250]">
            {formatARS(montoEfectivo)}
          </span>
          <div className="w-7 h-7 rounded-lg bg-[rgba(45,50,80,0.05)] flex items-center justify-center">
            {open ? <FiChevronUp size={13} color="#5b7a8a" /> : <FiChevronDown size={13} color="#5b7a8a" />}
          </div>
        </div>
      </button>

      {/* Panel expandido */}
      {open && (
        <div id={panelId} role="region" style={{ borderTop: `1px solid ${est.border}` }}>

          {/* Alertas */}
          {exp.estado === "vencido" && (
            <div className="flex items-center gap-2 px-5 py-[10px] bg-[rgba(185,28,28,0.04)] border-b border-[rgba(185,28,28,0.1)]">
              <FiAlertCircle size={13} color="#b91c1c" />
              <span className="font-['Raleway'] text-[12px] text-[#b91c1c] font-medium">
                Esta expensa está vencida. Regularizá tu situación lo antes posible.
              </span>
            </div>
          )}
          {itemMorosidad && (
            <div className="flex items-center gap-2 px-5 py-[10px] bg-[rgba(185,28,28,0.04)] border-b border-[rgba(185,28,28,0.1)]">
              <FiAlertCircle size={13} color="#b91c1c" />
              <span className="font-['Raleway'] text-[12px] text-[#b91c1c] font-medium">
                Se incluyó deuda anterior con recargo por morosidad (3%).
              </span>
            </div>
          )}

          {/* Detalle liquidación */}
          <div className="px-5 py-[18px]">
            <p className="font-['Raleway'] text-[10px] font-bold text-[#5b7a8a] m-0 mb-3 uppercase tracking-[0.08em]">
              Detalle de la liquidación
            </p>

            <div className="flex flex-col gap-[2px] mb-4">
              {itemsEfectivos.map((item, i) => {
                const pct          = Math.max(0, Math.min(100, Math.round((item.monto / (montoEfectivo || 1)) * 100)));
                const esMorosidad  = item._morosidad === true;
                return (
                  <div
                    key={i}
                    className="grid items-center gap-3 px-3 py-[9px] rounded-[10px]"
                    style={{
                      gridTemplateColumns: "1fr auto auto",
                      background: esMorosidad ? "rgba(185,28,28,0.05)" : i % 2 === 0 ? "rgba(240,244,248,0.8)" : "transparent",
                      border: esMorosidad ? "1px solid rgba(185,28,28,0.15)" : "none",
                    }}
                  >
                    <div className="flex items-center gap-[7px]">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: esMorosidad ? "#b91c1c" : ITEM_COLORS[i % ITEM_COLORS.length] }}
                      />
                      <span
                        className="font-['Raleway'] text-[12px]"
                        style={{ color: esMorosidad ? "#b91c1c" : "#2d3250", fontWeight: esMorosidad ? 600 : 400 }}
                      >
                        {item.concepto}
                      </span>
                    </div>

                    <span
                      className="font-['Raleway'] text-[10px] font-semibold px-2 py-[2px] rounded-[20px] whitespace-nowrap"
                      style={{
                        color: esMorosidad ? "#b91c1c" : "#5b7a8a",
                        background: esMorosidad ? "rgba(185,28,28,0.08)" : "rgba(91,158,160,0.08)",
                        border: `1px solid ${esMorosidad ? "rgba(185,28,28,0.2)" : "rgba(91,158,160,0.15)"}`,
                      }}
                    >
                      {pct}%
                    </span>

                    <span
                      className="font-['Urbanist'] text-[13px] font-bold text-right whitespace-nowrap"
                      style={{ color: esMorosidad ? "#b91c1c" : "#2d3250" }}
                    >
                      {formatARS(item.monto)}
                    </span>
                  </div>
                );
              })}

              <div className="h-px bg-[rgba(176,207,208,0.5)] my-[6px]" />

              {/* Total */}
              <div className="grid items-center gap-3 px-[14px] py-3 rounded-[10px] bg-[rgba(42,107,110,0.07)] border border-[rgba(42,107,110,0.15)]" style={{ gridTemplateColumns: "1fr auto" }}>
                <span className="font-['Raleway'] text-[13px] font-bold text-[#2a6b6e]">Total</span>
                <span className="font-['Urbanist'] text-[18px] font-extrabold text-[#2a6b6e]">
                  {formatARS(montoEfectivo)}
                </span>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-between flex-wrap gap-[10px] pt-[14px] border-t border-[rgba(176,207,208,0.4)]">
              <BtnDescargar loading={!!descargando["dl"]} onClick={handleDescargar} />

              {esPagable && (
                <button
                  type="button"
                  onClick={() => navigate(`/expensas/pagar/${exp.id}`)}
                  className="inline-flex items-center gap-[7px] px-[22px] py-[9px] rounded-[10px] border-none font-['Raleway'] text-[12px] font-bold text-white cursor-pointer touch-manipulation transition-all duration-[180ms] hover:-translate-y-px active:scale-[0.97]"
                  style={{
                    background: exp.estado === "vencido"
                      ? "linear-gradient(135deg, #b91c1c, #dc2626)"
                      : "linear-gradient(135deg, #2a6b6e, #3d8a8d)",
                    boxShadow: exp.estado === "vencido"
                      ? "0 4px 14px rgba(185,28,28,0.3)"
                      : "0 4px 14px rgba(42,107,110,0.28)",
                  }}
                >
                  <FiCreditCard size={13} /> Pagar ahora
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}