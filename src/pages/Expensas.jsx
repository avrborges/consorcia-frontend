import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getStoredUser } from "../hooks/useLogin";
import { useExpensasData } from "../hooks/useExpensasData";

import {
  FiDownload,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiCreditCard,
  FiCalendar,
} from "react-icons/fi";

/* ─────────────────────────────────────────
   Helpers UI (presentación)
───────────────────────────────────────── */
const ESTADO = {
  pago:                 { label: "Pagado",               color:"#2a6b6e", bg:"rgba(42,107,110,0.08)", border:"rgba(42,107,110,0.2)",  dot:"#2a6b6e", Icon:FiCheckCircle },
  pago_con_recargo:     { label: "Pagado c/ recargo",     color:"#c87941", bg:"rgba(249,177,122,0.10)", border:"rgba(249,177,122,0.3)", dot:"#f9b17a", Icon:FiCheckCircle },
  pendiente:            { label: "Pendiente",            color:"#c87941", bg:"rgba(249,177,122,0.10)", border:"rgba(249,177,122,0.3)", dot:"#f9b17a", Icon:FiClock },
  vencido:              { label: "Vencido",              color:"#b91c1c", bg:"rgba(185,28,28,0.07)",   border:"rgba(185,28,28,0.2)", dot:"#b91c1c", Icon:FiAlertCircle },
  vencido_pagado:       { label: "Vencido — pagado",     color:"#b91c1c", bg:"rgba(185,28,28,0.07)",   border:"rgba(185,28,28,0.15)", dot:"#b91c1c", Icon:FiCheckCircle },
  parcial:              { label: "Pago parcial",         color:"#7c5c9e", bg:"rgba(124,92,158,0.07)",  border:"rgba(124,92,158,0.2)", dot:"#9b7dc4", Icon:FiClock },
  pendiente_validacion: { label: "Pendiente validación", color:"#2a6b6e", bg:"rgba(42,107,110,0.07)",  border:"rgba(42,107,110,0.2)", dot:"#5b9ea0", Icon:FiClock },
  comprobante_rechazado:{ label: "Comprobante rechazado", color:"#b91c1c", bg:"rgba(185,28,28,0.07)", border:"rgba(185,28,28,0.2)", dot:"#b91c1c", Icon:FiAlertCircle },
};

const ITEM_COLORS = ["#2a6b6e", "#5b9ea0", "#8ecfd1", "#b0cfd0", "#f9b17a"];

const formatARS = (n) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

/* ─────────────────────────────────────────
   Fila (misma lógica UI que venías usando)
───────────────────────────────────────── */
function FilaExpensa({
  exp,
  defaultOpen = false,
  index = 0,
  isUltimoMes = false,
  onPaid,
  tendencia = null,
  itemMorosidad = null,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [pagando, setPagando] = useState(false);
  const [descargando, setDescargando] = useState({});

  const panelId = `exp-panel-${exp.id}`;
  const est = ESTADO[exp.estado] ?? ESTADO.pendiente;
  const EstIcon = est.Icon;

  const itemsEfectivos = itemMorosidad ? [...exp.items, itemMorosidad] : exp.items;
  const montoEfectivo = itemsEfectivos.reduce((s, i) => s + i.monto, 0);

  const esPagable = isUltimoMes && (exp.estado === "pendiente" || exp.estado === "vencido");

  const handlePagar = () => {
    if (pagando) return;
    setPagando(true);
    setTimeout(() => {
      setPagando(false);
      onPaid?.(exp.id);
    }, 1400);
  };

  const handleAccion = (label) => {
    if (descargando[label]) return;
    setDescargando((prev) => ({ ...prev, [label]: true }));
    setTimeout(() => setDescargando((prev) => ({ ...prev, [label]: false })), 1800);
  };

  const TendenciaChip = () => {
    if (tendencia === null || tendencia === 0) return null;
    const sube = tendencia > 0;
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 3,
          padding: "2px 7px",
          borderRadius: 20,
          background: sube ? "rgba(185,28,28,0.07)" : "rgba(42,107,110,0.08)",
          border: `1px solid ${sube ? "rgba(185,28,28,0.2)" : "rgba(42,107,110,0.2)"}`,
          fontFamily: "'Raleway', sans-serif",
          fontSize: 9,
          fontWeight: 700,
          color: sube ? "#b91c1c" : "#2a6b6e",
        }}
      >
        {sube ? "↑" : "↓"} {Math.abs(tendencia)}%
      </span>
    );
  };

  // Meses anteriores: compacto
  if (!isUltimoMes) {
    return (
      <div
        style={{
          borderRadius: 16,
          overflow: "hidden",
          background: "#fff",
          border: "1px solid #b0cfd0",
          boxShadow: "0 1px 4px rgba(45,50,80,0.05)",
          animation: `slideUp 0.35s ${index * 0.07}s cubic-bezier(0.22,1,0.36,1) both`,
        }}
      >
        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0, flex: 1 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                flexShrink: 0,
                background: est.bg,
                border: `1px solid ${est.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <EstIcon size={19} color={est.color} />
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                <span style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 15, fontWeight: 800, color: "#2d3250", lineHeight: 1 }}>
                  {exp.periodo}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "2px 9px",
                    borderRadius: 20,
                    background: est.bg,
                    border: `1px solid ${est.border}`,
                    fontFamily: "'Raleway', sans-serif",
                    fontSize: 9,
                    fontWeight: 700,
                    color: est.color,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: est.dot }} />
                  {est.label}
                </span>
                <TendenciaChip />
              </div>

              {exp.fechaPago && (
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: "#2a6b6e", margin: 0 }}>
                  Abonado el {exp.fechaPago}
                </p>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <span style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 16, fontWeight: 800, color: "#2d3250" }}>
              {formatARS(exp.monto)}
            </span>
          </div>
        </div>

        <div style={{ padding: "0 20px 16px", display: "flex", justifyContent: "flex-end", borderTop: "1px solid rgba(176,207,208,0.35)" }}>
          <button
            className="exp-action-btn"
            type="button"
            onClick={() => handleAccion("Descargar")}
            disabled={!!descargando["Descargar"]}
            style={{ opacity: descargando["Descargar"] ? 0.7 : 1 }}
          >
            {descargando["Descargar"] ? (
              <>
                <span className="exp-dl-spinner" /> Descargando...
              </>
            ) : (
              <>
                <FiDownload size={12} /> Descargar
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Último mes: completo (expandible)
  return (
    <div
      style={{
        borderRadius: 16,
        overflow: "hidden",
        background: "#fff",
        border: `1px solid ${open ? est.border : "#b0cfd0"}`,
        boxShadow: open ? `0 6px 28px rgba(45,50,80,0.10), 0 0 0 1px ${est.border}` : "0 1px 4px rgba(45,50,80,0.05)",
        transition: "box-shadow 0.25s, border-color 0.25s",
        animation: `slideUp 0.35s ${index * 0.07}s cubic-bezier(0.22,1,0.36,1) both`,
      }}
    >
      <button
        className="exp-header-btn"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0, flex: 1 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              flexShrink: 0,
              background: est.bg,
              border: `1px solid ${est.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EstIcon size={19} color={est.color} />
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
              <span style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 15, fontWeight: 800, color: "#2d3250", lineHeight: 1 }}>
                {exp.periodo}
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "2px 9px",
                  borderRadius: 20,
                  background: est.bg,
                  border: `1px solid ${est.border}`,
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: 9,
                  fontWeight: 700,
                  color: est.color,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: est.dot }} />
                {est.label}
              </span>
              <TendenciaChip />
            </div>

            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: "#5b7a8a", margin: 0 }}>
              {exp.unidad} · Vto. 1: {exp.vencimiento1} · Vto. 2: {exp.vencimiento2}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 16, fontWeight: 800, color: "#2d3250" }}>
            {formatARS(montoEfectivo)}
          </span>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(45,50,80,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {open ? <FiChevronUp size={13} color="#5b7a8a" /> : <FiChevronDown size={13} color="#5b7a8a" />}
          </div>
        </div>
      </button>

      {open && (
        <div id={panelId} role="region" style={{ borderTop: `1px solid ${est.border}` }}>
          {exp.estado === "vencido" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "rgba(185,28,28,0.04)", borderBottom: "1px solid rgba(185,28,28,0.1)" }}>
              <FiAlertCircle size={13} color="#b91c1c" />
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, color: "#b91c1c", fontWeight: 500 }}>
                Esta expensa está vencida. Regularizá tu situación lo antes posible.
              </span>
            </div>
          )}

          {itemMorosidad && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "rgba(185,28,28,0.04)", borderBottom: "1px solid rgba(185,28,28,0.1)" }}>
              <FiAlertCircle size={13} color="#b91c1c" />
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, color: "#b91c1c", fontWeight: 500 }}>
                Se incluyó deuda anterior con recargo por morosidad (3%).
              </span>
            </div>
          )}

          <div style={{ padding: "18px 20px" }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 700, color: "#5b7a8a", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Detalle de la liquidación
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 16 }}>
              {itemsEfectivos.map((item, i) => {
                const safeMonto = montoEfectivo || 1;
                const pct = Math.max(0, Math.min(100, Math.round((item.monto / safeMonto) * 100)));
                const esMorosidad = item._morosidad === true;

                return (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto auto",
                      alignItems: "center",
                      gap: 12,
                      padding: "9px 12px",
                      borderRadius: 10,
                      background: esMorosidad ? "rgba(185,28,28,0.05)" : i % 2 === 0 ? "rgba(240,244,248,0.8)" : "transparent",
                      border: esMorosidad ? "1px solid rgba(185,28,28,0.15)" : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: esMorosidad ? "#b91c1c" : ITEM_COLORS[i % ITEM_COLORS.length], flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, color: esMorosidad ? "#b91c1c" : "#2d3250", fontWeight: esMorosidad ? 600 : 400 }}>
                        {item.concepto}
                      </span>
                    </div>

                    <span
                      style={{
                        fontFamily: "'Raleway', sans-serif",
                        fontSize: 10,
                        fontWeight: 600,
                        color: esMorosidad ? "#b91c1c" : "#5b7a8a",
                        background: esMorosidad ? "rgba(185,28,28,0.08)" : "rgba(91,158,160,0.08)",
                        border: `1px solid ${esMorosidad ? "rgba(185,28,28,0.2)" : "rgba(91,158,160,0.15)"}`,
                        padding: "2px 8px",
                        borderRadius: 20,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {pct}%
                    </span>

                    <span style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 13, fontWeight: 700, color: esMorosidad ? "#b91c1c" : "#2d3250", textAlign: "right", whiteSpace: "nowrap" }}>
                      {formatARS(item.monto)}
                    </span>
                  </div>
                );
              })}

              <div style={{ height: 1, background: "rgba(176,207,208,0.5)", margin: "6px 0" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: "rgba(42,107,110,0.07)", border: "1px solid rgba(42,107,110,0.15)" }}>
                <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 13, fontWeight: 700, color: "#2a6b6e" }}>Total</span>
                <span style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 18, fontWeight: 800, color: "#2a6b6e" }}>{formatARS(montoEfectivo)}</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, paddingTop: 14, borderTop: "1px solid rgba(176,207,208,0.4)" }}>
              <button className="exp-action-btn" type="button" onClick={() => handleAccion("Descargar")} disabled={!!descargando["Descargar"]} style={{ opacity: descargando["Descargar"] ? 0.7 : 1 }}>
                {descargando["Descargar"] ? (
                  <>
                    <span className="exp-dl-spinner" /> Descargando...
                  </>
                ) : (
                  <>
                    <FiDownload size={12} /> Descargar
                  </>
                )}
              </button>

              {esPagable && (
                <button
                  type="button"
                  className="exp-pay-btn"
                  onClick={handlePagar}
                  disabled={pagando}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "9px 22px",
                    borderRadius: 10,
                    border: "none",
                    background: exp.estado === "vencido" ? "linear-gradient(135deg, #b91c1c, #dc2626)" : "linear-gradient(135deg, #2a6b6e, #3d8a8d)",
                    fontFamily: "'Raleway', sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#fff",
                    cursor: pagando ? "not-allowed" : "pointer",
                    opacity: pagando ? 0.75 : 1,
                    boxShadow: exp.estado === "vencido" ? "0 4px 14px rgba(185,28,28,0.3)" : "0 4px 14px rgba(42,107,110,0.28)",
                  }}
                >
                  {pagando ? (
                    <>
                      <span className="exp-spinner" /> Procesando...
                    </>
                  ) : (
                    <>
                      <FiCreditCard size={13} /> Pagar ahora
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Página principal (refactor: datos via hook)
───────────────────────────────────────── */
export default function Expensas() {
  const outletContext = useOutletContext();
  const consorcioId = outletContext?.consorcioId ?? "c1";
  const storedUser = getStoredUser();
  const email = storedUser?.email ?? "";

  const {
    historial,
    resumen,
    tendencias,
    itemMorosidad,
    ultimoPeriodoKey,
    loading,
    error,
    periodoToKey,
  } = useExpensasData(consorcioId, email);

  const [filtroEstado, setFiltroEstado] = useState("todas");
  useEffect(() => setFiltroEstado("todas"), [email, consorcioId]);

  const saldoEnRojo = resumen.vencidas > 0;

  const STATS = [
    {
      label: "Saldo pendiente",
      val: formatARS(resumen.saldo),
      color: saldoEnRojo ? "#b91c1c" : "#2d3250",
      bg: saldoEnRojo ? "rgba(185,28,28,0.08)" : "rgba(91,158,160,0.06)",
      border: saldoEnRojo ? "rgba(185,28,28,0.30)" : "rgba(91,158,160,0.18)",
      accent: saldoEnRojo ? "#b91c1c" : "#5b9ea0",
    },
  ];

  const historialFiltrado = useMemo(() => {
    if (filtroEstado === "todas") return historial;
    if (filtroEstado === "pago") return historial.filter((e) => ["pago", "pago_con_recargo", "vencido_pagado"].includes(e.estado));
    return historial.filter((e) => e.estado === filtroEstado);
  }, [historial, filtroEstado]);

  const handlePaid = (id) => {
    // UI-only: en tu implementación real, acá podrías llamar al backend y refetch.
    // Por ahora, como el estado vive en el hook (mock), el "pago" es demostrativo.
    // Si querés, te paso una versión del hook que exponga `markAsPaid(id)` para mantener coherencia.
    console.log("Pago realizado:", id);
  };

  return (
    <div style={{ minHeight: "100%", fontFamily: "'Raleway', sans-serif", display: "flex", flexDirection: "column", gap: 20 }}>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .exp-spinner { width: 13px; height: 13px; border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display:inline-block; }
        .exp-dl-spinner { width: 11px; height: 11px; border: 2px solid rgba(91,122,138,0.3); border-top-color: #5b7a8a; border-radius: 50%; animation: spin 0.7s linear infinite; display:inline-block; }
        .exp-action-btn { display:inline-flex; align-items:center; gap:5px; padding:7px 13px; border-radius:9px; border:1px solid #b0cfd0; background:transparent; font-family:'Raleway',sans-serif; font-size:11px; font-weight:600; color:#5b7a8a; cursor:pointer; transition:all .15s; }
        .exp-action-btn:hover { border-color:#5b9ea0; color:#2a6b6e; background:rgba(91,158,160,0.05); }
        .exp-filter-chip:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(45,50,80,0.06); }
        .exp-filter-chip:active { transform: translateY(0); }
      `}</style>

      {/* Header */}
      <div style={{ animation: "slideUp 0.35s cubic-bezier(0.22,1,0.36,1) both" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, fontWeight: 600, color: "#5b9ea0", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Mis expensas
            </p>
            <h1 style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 24, fontWeight: 800, color: "#2d3250", margin: 0, lineHeight: 1 }}>
              Historial de liquidaciones
            </h1>
          </div>

          {resumen.vencidas > 0 && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, background: "rgba(185,28,28,0.08)", border: "1px solid rgba(185,28,28,0.2)" }}>
              <FiAlertCircle size={12} color="#b91c1c" />
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, fontWeight: 700, color: "#b91c1c" }}>
                {resumen.vencidas} vencida{resumen.vencidas > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Loading/Error */}
      {loading && <div style={{ padding: 16, color: "#5b7a8a" }}>Cargando expensas…</div>}
      {error && <div style={{ padding: 16, color: "#b91c1c" }}>{error}</div>}

      {!loading && !error && (
        <>
          {/* Filtros */}
          {historial.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                { key: "todas", label: "Todas", count: historial.length },
                { key: "pendiente", label: "Pendientes", count: resumen.pendientes },
                { key: "vencido", label: "Vencidas", count: resumen.vencidas },
                { key: "parcial", label: "Parciales", count: resumen.parciales },
                { key: "pendiente_validacion", label: "Pendiente validación", count: resumen.pendienteValidacion },
                { key: "comprobante_rechazado", label: "Comprobante rechazado", count: resumen.rechazados },
                { key: "pago", label: "Pagadas", count: resumen.pagas },
              ]
                .filter((f) => f.key === "todas" || f.count > 0)
                .map((f) => {
                  const active = filtroEstado === f.key;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      className="exp-filter-chip"
                      onClick={() => setFiltroEstado(f.key)}
                      aria-pressed={active}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "7px 12px",
                        borderRadius: 999,
                        border: `1px solid ${active ? "rgba(91,158,160,0.35)" : "rgba(176,207,208,0.55)"}`,
                        background: active ? "rgba(91,158,160,0.06)" : "rgba(255,255,255,0.65)",
                        cursor: "pointer",
                        transition: "all .15s",
                      }}
                    >
                      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, fontWeight: 700, color: active ? "#2d3250" : "#5b7a8a" }}>
                        {f.label}
                      </span>
                      <span style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 12, fontWeight: 900, color: "#2d3250" }}>{f.count}</span>
                    </button>
                  );
                })}
            </div>
          )}

          {/* Stat saldo */}
          {historial.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
              {STATS.map((s, i) => (
                <div key={i} style={{ padding: "12px 16px", borderRadius: 12, background: s.bg, border: `1px solid ${s.border}`, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: s.accent, borderRadius: "12px 0 0 12px" }} />
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 600, color: "#5b7a8a", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    {s.label}
                  </p>
                  <p style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 16, fontWeight: 900, color: s.color, margin: 0, lineHeight: 1 }}>
                    {s.val}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Lista */}
          {historial.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid #b0cfd0", borderRadius: 16, padding: "48px 20px", textAlign: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(176,207,208,0.15)", border: "1px solid rgba(176,207,208,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <FiCalendar size={22} color="#b0cfd0" />
              </div>
              <p style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 15, fontWeight: 700, color: "#2d3250", margin: "0 0 4px" }}>Sin expensas</p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, color: "#5b7a8a", margin: 0 }}>
                No hay liquidaciones registradas para este consorcio.
              </p>
            </div>
          ) : historialFiltrado.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid #b0cfd0", borderRadius: 16, padding: "42px 20px", textAlign: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(91,158,160,0.10)", border: "1px solid rgba(91,158,160,0.22)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <FiCalendar size={22} color="#5b9ea0" />
              </div>
              <p style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 15, fontWeight: 800, color: "#2d3250", margin: "0 0 4px" }}>Sin resultados</p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, color: "#5b7a8a", margin: 0 }}>
                No hay expensas para el filtro seleccionado.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {historialFiltrado.map((exp, i) => {
                const isUltimoMes = periodoToKey(exp.periodo) === ultimoPeriodoKey;
                return (
                  <FilaExpensa
                    key={`${filtroEstado}-${exp.id}`}
                    exp={exp}
                    defaultOpen={isUltimoMes && i === 0}
                    index={i}
                    isUltimoMes={isUltimoMes}
                    onPaid={handlePaid}
                    tendencia={tendencias[exp.id] ?? null}
                    itemMorosidad={isUltimoMes ? itemMorosidad : null}
                  />
                );
              })}
            </div>
          )}
        </>
      )}

      <div style={{ height: 16 }} />
    </div>
  );
}