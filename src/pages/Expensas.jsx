import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getStoredUser } from "../features/auth/hooks/useLogin";
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
   Mock data
───────────────────────────────────────── */
/* ─────────────────────────────────────────
   Generador dinámico de mock data
   Los períodos se calculan a partir de la
   fecha actual para que siempre estén vigentes
───────────────────────────────────────── */
const MESES_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function pad(n) { return String(n).padStart(2, "0"); }

// Devuelve { periodo, vencimiento1, vencimiento2 } para N meses atrás (0 = mes actual)
function getPeriodo(mesesAtras = 0) {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - mesesAtras);
  const mes  = d.getMonth();       // 0-11
  const anio = d.getFullYear();
  // Vencimientos: mes siguiente al período
  const sigMes  = mes === 11 ? 0 : mes + 1;
  const sigAnio = mes === 11 ? anio + 1 : anio;
  return {
    periodo:      `${MESES_ES[mes]} ${anio}`,
    vencimiento1: `15/${pad(sigMes + 1)}/${sigAnio}`,
    vencimiento2: `25/${pad(sigMes + 1)}/${sigAnio}`,
    mesKey:       `${pad(mes + 1)}${String(anio).slice(2)}`,
  };
}

function formatFechaPago(dia, mesesAtras) {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - mesesAtras + 1); // mes de vencimiento
  return `${pad(dia)}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function buildHistorial(unidad, baseMontos, estados) {
  // estados: array de { estado, fechaPagoDia? } del más reciente al más antiguo
  return estados.map((s, i) => {
    const p = getPeriodo(i);
    const montoBase = baseMontos[i] ?? baseMontos[baseMontos.length - 1];
    const items = [
      { concepto: "Expensa ordinaria",      monto: Math.round(montoBase * 0.66) },
      { concepto: "Fondo de reserva",       monto: Math.round(montoBase * 0.12) },
      { concepto: "Seguro del edificio",    monto: Math.round(montoBase * 0.10) },
      { concepto: "Servicio de limpieza",   monto: Math.round(montoBase * 0.09) },
      { concepto: "Mantenimiento ascensor", monto: Math.round(montoBase * 0.03) },
    ];
    // Ajuste para que la suma sea exacta
    const suma = items.reduce((a, b) => a + b.monto, 0);
    items[0].monto += montoBase - suma;

    const entry = {
      id:          `e-${unidad.replace(/\s/g, "")}-${p.mesKey}`,
      periodo:     p.periodo,
      vencimiento1: p.vencimiento1,
      vencimiento2: p.vencimiento2,
      estado:      s.estado,
      monto:       montoBase,
      unidad,
      items,
    };

    if (s.fechaPagoDia) {
      entry.fechaPago = formatFechaPago(s.fechaPagoDia, i);
    }

    // pago_con_recargo: agrega ítem de recargo
    if (s.estado === "pago_con_recargo") {
      const recargo = Math.round(montoBase * 0.03);
      entry.items.push({ concepto: "Recargo 2do vencimiento (3%)", monto: recargo, _recargo: true });
      entry.monto = montoBase + recargo;
    }

    // vencido_pagado: agrega ítem de morosidad pero no arrastra
    if (s.estado === "vencido_pagado") {
      const recargo = Math.round(montoBase * 0.03);
      entry.items.push({ concepto: "Recargo por morosidad (3%)", monto: recargo, _recargo: true });
      entry.monto = montoBase + recargo;
    }

    return entry;
  });
}

const MOCK_HISTORIAL = {
  "owner@consorcia.com": {
    // c1: período actual pendiente, mes anterior con recargo, 2 pagados, 1 vencido_pagado, 1 vencido (arrastra morosidad)
    c1: buildHistorial("Unidad 3B", [42500, 41200, 39500, 38000, 37000], [
      { estado: "pendiente"         },
      { estado: "pago_con_recargo", fechaPagoDia: 20 },
      { estado: "pago",             fechaPagoDia:  8 },
      { estado: "vencido_pagado",   fechaPagoDia:  2 },
      { estado: "vencido"           },
    ]),
    // c2: período actual pendiente, mes anterior vencido (arrastra morosidad al período actual)
    c2: buildHistorial("Unidad 5D", [55000, 52000], [
      { estado: "pendiente"         },
      { estado: "vencido"           },
    ]),
  },
  "owner2@consorcia.com": {
    c3: buildHistorial("Unidad 4A", [31000, 30000], [
      { estado: "pago", fechaPagoDia: 3 },
      { estado: "pago", fechaPagoDia: 2 },
    ]),
  },
  "tenant@consorcia.com": {
    c1: buildHistorial("Unidad 3B", [42500, 40000], [
      { estado: "pendiente"         },
      { estado: "pago",             fechaPagoDia:  9 },
    ]),
  },
};



/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
const ESTADO = {
  pago: {
    label: "Pagado",
    color: "#2a6b6e",
    bg: "rgba(42,107,110,0.08)",
    border: "rgba(42,107,110,0.2)",
    dot: "#2a6b6e",
    Icon: FiCheckCircle,
  },
  pago_con_recargo: {
    label: "Pagado c/ recargo",
    color: "#c87941",
    bg: "rgba(249,177,122,0.10)",
    border: "rgba(249,177,122,0.3)",
    dot: "#f9b17a",
    Icon: FiCheckCircle,
  },
  pendiente: {
    label: "Pendiente",
    color: "#c87941",
    bg: "rgba(249,177,122,0.10)",
    border: "rgba(249,177,122,0.3)",
    dot: "#f9b17a",
    Icon: FiClock,
  },
  vencido: {
    label: "Vencido",
    color: "#b91c1c",
    bg: "rgba(185,28,28,0.07)",
    border: "rgba(185,28,28,0.2)",
    dot: "#b91c1c",
    Icon: FiAlertCircle,
  },
  vencido_pagado: {
    label: "Vencido — pagado",
    color: "#b91c1c",
    bg: "rgba(185,28,28,0.07)",
    border: "rgba(185,28,28,0.15)",
    dot: "#b91c1c",
    Icon: FiCheckCircle,
  },
  parcial: {
    label: "Pago parcial",
    color: "#7c5c9e",
    bg: "rgba(124,92,158,0.07)",
    border: "rgba(124,92,158,0.2)",
    dot: "#9b7dc4",
    Icon: FiClock,
  },
  pendiente_validacion: {
    label: "Pendiente validación",
    color: "#2a6b6e",
    bg: "rgba(42,107,110,0.07)",
    border: "rgba(42,107,110,0.2)",
    dot: "#5b9ea0",
    Icon: FiClock,
  },
  comprobante_rechazado: {
    label: "Comprobante rechazado",
    color: "#b91c1c",
    bg: "rgba(185,28,28,0.07)",
    border: "rgba(185,28,28,0.2)",
    dot: "#b91c1c",
    Icon: FiAlertCircle,
  },
};

const ITEM_COLORS = ["#2a6b6e", "#5b9ea0", "#8ecfd1", "#b0cfd0", "#f9b17a"];

const formatARS = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

const MONTHS_ES = {
  enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
  julio: 7, agosto: 8, septiembre: 9, setiembre: 9, octubre: 10,
  noviembre: 11, diciembre: 12,
};

function periodoToKey(periodo) {
  if (!periodo || typeof periodo !== "string") return -1;
  const parts = periodo.trim().toLowerCase().split(/\s+/);
  if (parts.length < 2) return -1;
  const mes = MONTHS_ES[parts[0]];
  const anio = Number(parts[1]);
  if (!mes || !anio) return -1;
  return anio * 12 + mes;
}

/* ─────────────────────────────────────────
   Fila de expensa
───────────────────────────────────────── */
function FilaExpensa({ exp, defaultOpen = false, index = 0, isUltimoMes = false, onPaid, tendencia = null, itemMorosidad = null }) {
  const [open, setOpen] = useState(defaultOpen);
  const [pagando, setPagando] = useState(false);
  const [pagadoLocal, setPagadoLocal] = useState(false);
  const [descargando, setDescargando] = useState({});

  const panelId = `exp-panel-${exp.id}`;
  const est = ESTADO[exp.estado] ?? ESTADO.pendiente;
  const estEfectivo = pagadoLocal ? ESTADO.pago : est;
  const EstIcon = estEfectivo.Icon;

  // Items efectivos: los propios + morosidad si corresponde
  const itemsEfectivos = itemMorosidad
    ? [...exp.items, itemMorosidad]
    : exp.items;
  const montoEfectivo = itemsEfectivos.reduce((s, i) => s + i.monto, 0);

  const esPagable = isUltimoMes && (exp.estado === "pendiente" || exp.estado === "vencido") && exp.estado !== "pago";
  const acciones = [{ icon: FiDownload, label: "Descargar" }];

  const handlePagar = () => {
    if (pagando) return;
    setPagando(true);
    setTimeout(() => { setPagando(false); setPagadoLocal(true); onPaid?.(); }, 1400);
  };

  const handleAccion = (label) => {
    if (descargando[label]) return;
    setDescargando(prev => ({ ...prev, [label]: true }));
    setTimeout(() => setDescargando(prev => ({ ...prev, [label]: false })), 1800);
  };

  const TendenciaChip = () => {
    if (tendencia === null || tendencia === 0) return null;
    const sube = tendencia > 0;
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 7px", borderRadius: 20, background: sube ? "rgba(185,28,28,0.07)" : "rgba(42,107,110,0.08)", border: `1px solid ${sube ? "rgba(185,28,28,0.2)" : "rgba(42,107,110,0.2)"}`, fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 700, color: sube ? "#b91c1c" : "#2a6b6e" }}>
        {sube ? "↑" : "↓"} {Math.abs(tendencia)}%
      </span>
    );
  };

  if (!isUltimoMes) {
    return (
      <div style={{
        borderRadius: 16, overflow: "hidden", background: "#fff",
        border: "1px solid #b0cfd0", boxShadow: "0 1px 4px rgba(45,50,80,0.05)",
        animation: `slideUp 0.35s ${index * 0.07}s cubic-bezier(0.22,1,0.36,1) both`,
      }}>
        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}
          aria-label={`Expensa ${exp.periodo}. Estado ${est.label}. Total ${formatARS(exp.monto)}.`}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0, flex: 1 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: est.bg, border: `1px solid ${est.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <EstIcon size={19} color={est.color} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                <span style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 15, fontWeight: 800, color: "#2d3250", lineHeight: 1 }}>{exp.periodo}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 9px", borderRadius: 20, background: est.bg, border: `1px solid ${est.border}`, fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 700, color: est.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
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
          <div className="exp-right" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <span className="exp-amount" style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 16, fontWeight: 800, color: "#2d3250" }}>{formatARS(exp.monto)}</span>
          </div>
        </div>
        <div style={{ padding: "0 20px 16px", display: "flex", justifyContent: "flex-end", borderTop: "1px solid rgba(176,207,208,0.35)" }}>
          <div style={{ display: "flex", gap: 8 }}>
            {acciones.map(({ icon: Icon, label }) => (
              <button key={label} className="exp-action-btn" type="button"
                onClick={() => handleAccion(label)}
                disabled={!!descargando[label]}
                style={{ opacity: descargando[label] ? 0.7 : 1 }}
              >
                {descargando[label]
                  ? <><span className="exp-dl-spinner" /> {label === "Descargar" ? "Descargando..." : "Imprimiendo..."}</>
                  : <><Icon size={12} /> {label}</>
                }
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      borderRadius: 16, overflow: "hidden", background: "#fff",
      border: `1px solid ${open ? estEfectivo.border : "#b0cfd0"}`,
      boxShadow: open ? `0 6px 28px rgba(45,50,80,0.10), 0 0 0 1px ${estEfectivo.border}` : "0 1px 4px rgba(45,50,80,0.05)",
      transition: "box-shadow 0.25s, border-color 0.25s",
      animation: `slideUp 0.35s ${index * 0.07}s cubic-bezier(0.22,1,0.36,1) both`,
    }}>

      {/* Badge período actual */}
      <div style={{ padding: "8px 20px 0", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, background: "rgba(42,107,110,0.08)", border: "1px solid rgba(42,107,110,0.2)", fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 700, color: "#2a6b6e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#2a6b6e" }} />
          Período actual
        </span>
      </div>

      <button className="exp-header-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={panelId}
        aria-label={`Expensa ${exp.periodo}. Estado ${pagadoLocal ? "Pagado" : est.label}. Total ${formatARS(exp.monto)}`}
        style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "12px 20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0, flex: 1 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: estEfectivo.bg, border: `1px solid ${estEfectivo.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <EstIcon size={19} color={estEfectivo.color} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
              <span style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 15, fontWeight: 800, color: "#2d3250", lineHeight: 1 }}>{exp.periodo}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 9px", borderRadius: 20, background: estEfectivo.bg, border: `1px solid ${estEfectivo.border}`, fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 700, color: estEfectivo.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: estEfectivo.dot }} />
                {pagadoLocal ? "Pagado" : est.label}
              </span>
              <TendenciaChip />
            </div>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: "#5b7a8a", margin: 0 }}>
              {exp.unidad} · Vto. 1: {exp.vencimiento1} · Vto. 2: {exp.vencimiento2}
            </p>
          </div>
        </div>
        <div className="exp-right" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span className="exp-amount" style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 16, fontWeight: 800, color: "#2d3250" }}>{formatARS(isUltimoMes ? montoEfectivo : exp.monto)}</span>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(45,50,80,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {open ? <FiChevronUp size={13} color="#5b7a8a" /> : <FiChevronDown size={13} color="#5b7a8a" />}
          </div>
        </div>
      </button>

      {open && (
        <div id={panelId} role="region" aria-label={`Detalle de liquidación ${exp.periodo}`} style={{ borderTop: `1px solid ${estEfectivo.border}` }}>
          {exp.estado === "vencido" && !pagadoLocal && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "rgba(185,28,28,0.04)", borderBottom: "1px solid rgba(185,28,28,0.1)" }}>
              <FiAlertCircle size={13} color="#b91c1c" />
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, color: "#b91c1c", fontWeight: 500 }}>Esta expensa está vencida. Regularizá tu situación lo antes posible.</span>
            </div>
          )}
          {/* Alerta morosidad */}
          {itemMorosidad && !pagadoLocal && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "rgba(185,28,28,0.04)", borderBottom: "1px solid rgba(185,28,28,0.1)" }}>
              <FiAlertCircle size={13} color="#b91c1c" />
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, color: "#b91c1c", fontWeight: 500 }}>
                Se incluyó deuda anterior con recargo por morosidad (3%).
              </span>
            </div>
          )}
          <div style={{ padding: "18px 20px" }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 700, color: "#5b7a8a", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Detalle de la liquidación</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 16 }}>
              {itemsEfectivos.map((item, i) => {
                const esMorosidad = item._morosidad === true;
                const safeMonto = montoEfectivo || 1;
                const pct = Math.max(0, Math.min(100, Math.round((item.monto / safeMonto) * 100)));
                return (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "1fr auto auto",
                    alignItems: "center", gap: 12, padding: "9px 12px", borderRadius: 10,
                    background: esMorosidad
                      ? "rgba(185,28,28,0.05)"
                      : i % 2 === 0 ? "rgba(240,244,248,0.8)" : "transparent",
                    border: esMorosidad ? "1px solid rgba(185,28,28,0.15)" : "none",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: esMorosidad ? "#b91c1c" : ITEM_COLORS[i % ITEM_COLORS.length], flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, color: esMorosidad ? "#b91c1c" : "#2d3250", fontWeight: esMorosidad ? 600 : 400 }}>{item.concepto}</span>
                    </div>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 600, color: esMorosidad ? "#b91c1c" : "#5b7a8a", background: esMorosidad ? "rgba(185,28,28,0.08)" : "rgba(91,158,160,0.08)", border: `1px solid ${esMorosidad ? "rgba(185,28,28,0.2)" : "rgba(91,158,160,0.15)"}`, padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>{pct}%</span>
                    <span style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 13, fontWeight: 700, color: esMorosidad ? "#b91c1c" : "#2d3250", textAlign: "right", whiteSpace: "nowrap" }}>{formatARS(item.monto)}</span>
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
              <div style={{ display: "flex", gap: 8 }}>
                {acciones.map(({ icon: Icon, label }) => (
                  <button key={label} className="exp-action-btn" type="button"
                    onClick={() => handleAccion(label)}
                    disabled={!!descargando[label]}
                    style={{ opacity: descargando[label] ? 0.7 : 1 }}
                  >
                    {descargando[label]
                      ? <><span className="exp-dl-spinner" /> Descargando...</>
                      : <><Icon size={12} /> {label}</>
                    }
                  </button>
                ))}
              </div>
              {esPagable && (
                <button type="button" className="exp-pay-btn" onClick={handlePagar} disabled={pagando}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 22px", borderRadius: 10, border: "none", background: exp.estado === "vencido" ? "linear-gradient(135deg, #b91c1c, #dc2626)" : "linear-gradient(135deg, #2a6b6e, #3d8a8d)", fontFamily: "'Raleway', sans-serif", fontSize: 12, fontWeight: 700, color: "#fff", cursor: pagando ? "not-allowed" : "pointer", opacity: pagando ? 0.75 : 1, boxShadow: exp.estado === "vencido" ? "0 4px 14px rgba(185,28,28,0.3)" : "0 4px 14px rgba(42,107,110,0.28)", transition: "opacity 0.15s, transform 0.15s" }}>
                  {pagando ? <><span className="exp-spinner" /> Procesando...</> : <><FiCreditCard size={13} /> Pagar ahora</>}
                </button>
              )}
              {(pagadoLocal || exp.estado === "pago") && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, background: "rgba(42,107,110,0.08)", border: "1px solid rgba(42,107,110,0.2)" }}>
                  <FiCheckCircle size={13} color="#2a6b6e" />
                  <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, fontWeight: 600, color: "#2a6b6e" }}>
                    {pagadoLocal ? "Pago registrado" : exp.fechaPago ? `Abonado el ${exp.fechaPago}` : "Abonado"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Página principal
───────────────────────────────────────── */
export default function Expensas() {
  const outletContext = useOutletContext();
  const consorcioId = outletContext?.consorcioId ?? "c1";
  const storedUser = getStoredUser();
  const email = storedUser?.email ?? "";

  const initialHistorial = useMemo(() => MOCK_HISTORIAL[email]?.[consorcioId] ?? [], [email, consorcioId]);
  const [historialState, setHistorialState] = useState(initialHistorial);

  useEffect(() => {
    setHistorialState(initialHistorial);
  }, [initialHistorial]);

  const historial = historialState;

  const marcarPagado = (id) => {
    setHistorialState((prev) => prev.map((e) => (e.id === id ? { ...e, estado: "pago" } : e)));
  };

  const resumen = useMemo(() => ({
    pagas:                historial.filter((e) => e.estado === "pago" || e.estado === "pago_con_recargo" || e.estado === "vencido_pagado").length,
    pendientes:           historial.filter((e) => e.estado === "pendiente").length,
    vencidas:             historial.filter((e) => e.estado === "vencido").length,
    parciales:            historial.filter((e) => e.estado === "parcial").length,
    pendienteValidacion:  historial.filter((e) => e.estado === "pendiente_validacion").length,
    rechazados:           historial.filter((e) => e.estado === "comprobante_rechazado").length,
    saldo:                historial.filter((e) => e.estado === "pendiente" || e.estado === "vencido" || e.estado === "parcial" || e.estado === "comprobante_rechazado").reduce((s, e) => s + e.monto, 0),
  }), [historial]);

  const STATS = [
    { label: "Saldo pendiente", val: formatARS(resumen.saldo), isNum: false, color: "#2d3250", bg: "rgba(91,158,160,0.06)", border: "rgba(91,158,160,0.18)", accent: "#5b9ea0" },
  ];

  const [filtroEstado, setFiltroEstado] = useState("todas");
  useEffect(() => { setFiltroEstado("todas"); }, [email, consorcioId]);

  // Calcula ítem de morosidad: solo si hay un mes con estado "vencido" estricto
  // (vencido_pagado no arrastra al período siguiente)
  const itemMorosidad = useMemo(() => {
    const vencido = historial.find(e => e.estado === "vencido");
    if (!vencido) return null;
    const recargo = Math.round(vencido.monto * 0.03);
    return {
      concepto: `Deuda anterior + recargo morosidad 3% (${vencido.periodo})`,
      monto: vencido.monto + recargo,
      _morosidad: true,
    };
  }, [historial]);
  const tendencias = useMemo(() => {
    const map = {};
    historial.forEach((exp, i) => {
      const prev = historial[i + 1];
      if (!prev || prev.monto === 0) { map[exp.id] = null; return; }
      const diff = ((exp.monto - prev.monto) / prev.monto) * 100;
      map[exp.id] = Math.round(diff);
    });
    return map;
  }, [historial]);

  const ultimoPeriodoKey = useMemo(() => {
    if (!historial.length) return -1;
    return historial.reduce((max, e) => Math.max(max, periodoToKey(e.periodo)), -1);
  }, [historial]);

  const historialFiltrado = useMemo(() => {
    if (filtroEstado === "todas") return historial;
    if (filtroEstado === "pago") return historial.filter((e) => ["pago", "pago_con_recargo", "vencido_pagado"].includes(e.estado));
    return historial.filter((e) => e.estado === filtroEstado);
  }, [historial, filtroEstado]);

  return (
    <div style={{ minHeight: "100%", fontFamily: "'Raleway', sans-serif", display: "flex", flexDirection: "column", gap: 20 }}>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .exp-spinner {
          width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite; flex-shrink: 0;
          display: inline-block;
        }
        .exp-dl-spinner {
          width: 11px; height: 11px;
          border: 2px solid rgba(91,122,138,0.3);
          border-top-color: #5b7a8a; border-radius: 50%;
          animation: spin 0.7s linear infinite; flex-shrink: 0;
          display: inline-block;
        }
        .exp-action-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 13px; border-radius: 9px;
          border: 1px solid #b0cfd0; background: transparent;
          font-family: 'Raleway', sans-serif; font-size: 11px; font-weight: 600;
          color: #5b7a8a; cursor: pointer; transition: all .15s;
        }
        .exp-action-btn:hover { border-color: #5b9ea0; color: #2a6b6e; background: rgba(91,158,160,0.05); }
        .exp-pay-btn:not(:disabled):hover { transform: translateY(-1px); }
        .exp-pay-btn:disabled { transform: none; }
        .exp-filter-chip:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(45,50,80,0.06); }
        .exp-filter-chip:active { transform: translateY(0); }
        @media (max-width: 420px) {
          .exp-header-btn { padding: 14px 14px !important; }
          .exp-amount { font-size: 14px !important; }
          .exp-right { gap: 8px !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ animation: "slideUp 0.35s cubic-bezier(0.22,1,0.36,1) both" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, fontWeight: 600, color: "#5b9ea0", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Mis expensas</p>
            <h1 style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 24, fontWeight: 800, color: "#2d3250", margin: 0, lineHeight: 1 }}>Historial de liquidaciones</h1>
          </div>
          {resumen.vencidas > 0 && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, background: "rgba(185,28,28,0.08)", border: "1px solid rgba(185,28,28,0.2)", animation: "slideUp 0.35s 0.1s cubic-bezier(0.22,1,0.36,1) both" }}>
              <FiAlertCircle size={12} color="#b91c1c" />
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, fontWeight: 700, color: "#b91c1c" }}>{resumen.vencidas} vencida{resumen.vencidas > 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
      </div>

      {/* Filtros */}
      {historial.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, animation: "slideUp 0.35s 0.04s cubic-bezier(0.22,1,0.36,1) both" }} aria-label="Filtro por estado de expensas">
          {[
            { key: "todas",                 label: "Todas",                  count: historial.length,              color: "#2d3250", bg: "rgba(91,158,160,0.06)",   border: "rgba(91,158,160,0.18)",   dot: "#5b9ea0"  },
            { key: "pendiente",             label: "Pendientes",             count: resumen.pendientes,            color: "#c87941", bg: "rgba(249,177,122,0.10)",  border: "rgba(249,177,122,0.30)",  dot: "#f9b17a"  },
            { key: "vencido",               label: "Vencidas",               count: resumen.vencidas,              color: resumen.vencidas > 0 ? "#b91c1c" : "#2a6b6e", bg: resumen.vencidas > 0 ? "rgba(185,28,28,0.06)" : "rgba(42,107,110,0.07)", border: resumen.vencidas > 0 ? "rgba(185,28,28,0.18)" : "rgba(42,107,110,0.18)", dot: resumen.vencidas > 0 ? "#b91c1c" : "#2a6b6e" },
            { key: "parcial",               label: "Parciales",              count: resumen.parciales,             color: "#7c5c9e", bg: "rgba(124,92,158,0.07)",   border: "rgba(124,92,158,0.20)",   dot: "#9b7dc4"  },
            { key: "pendiente_validacion",  label: "Pendiente validación",   count: resumen.pendienteValidacion,   color: "#2a6b6e", bg: "rgba(42,107,110,0.07)",   border: "rgba(42,107,110,0.18)",   dot: "#5b9ea0"  },
            { key: "comprobante_rechazado", label: "Comprobante rechazado",  count: resumen.rechazados,            color: "#b91c1c", bg: "rgba(185,28,28,0.06)",    border: "rgba(185,28,28,0.18)",    dot: "#b91c1c"  },
            { key: "pago",                  label: "Pagadas",                count: resumen.pagas,                 color: "#2a6b6e", bg: "rgba(42,107,110,0.08)",   border: "rgba(42,107,110,0.20)",   dot: "#2a6b6e"  },
          ].filter(f => f.key === "todas" || f.count > 0).map((f) => {
            const active = filtroEstado === f.key;
            return (
              <button key={f.key} type="button" className="exp-filter-chip" onClick={() => setFiltroEstado(f.key)} aria-pressed={active}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, border: `1px solid ${active ? f.border : "rgba(176,207,208,0.55)"}`, background: active ? f.bg : "rgba(255,255,255,0.65)", cursor: "pointer", transition: "all .15s", boxShadow: active ? "0 6px 18px rgba(45,50,80,0.07)" : "none" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: f.dot, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, fontWeight: 700, color: active ? f.color : "#5b7a8a", letterSpacing: "0.02em" }}>{f.label}</span>
                <span style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 12, fontWeight: 900, color: active ? f.color : "#2d3250", background: active ? "rgba(255,255,255,0.55)" : "rgba(45,50,80,0.06)", border: active ? `1px solid ${f.border}` : "1px solid rgba(45,50,80,0.08)", padding: "2px 8px", borderRadius: 999, lineHeight: 1.1 }}>{f.count}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Stat saldo */}
      {historial.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, animation: "slideUp 0.35s 0.06s cubic-bezier(0.22,1,0.36,1) both" }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ padding: "12px 16px", borderRadius: 12, background: s.bg, border: `1px solid ${s.border}`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: s.accent, borderRadius: "12px 0 0 12px" }} />
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 600, color: "#5b7a8a", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.label}</p>
              <p style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 16, fontWeight: 900, color: s.color, margin: 0, lineHeight: 1 }}>{s.val}</p>
            </div>
          ))}
        </div>
      )}

      {/* Lista */}
      {historial.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid #b0cfd0", borderRadius: 16, padding: "48px 20px", textAlign: "center", animation: "slideUp 0.35s 0.1s cubic-bezier(0.22,1,0.36,1) both" }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(176,207,208,0.15)", border: "1px solid rgba(176,207,208,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <FiCalendar size={22} color="#b0cfd0" />
          </div>
          <p style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 15, fontWeight: 700, color: "#2d3250", margin: "0 0 4px" }}>Sin expensas</p>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, color: "#5b7a8a", margin: 0 }}>No hay liquidaciones registradas para este consorcio.</p>
        </div>
      ) : (
        (() => {
          const list = filtroEstado === "todas" ? historial : historialFiltrado;
          if (list.length === 0) {
            return (
              <div style={{ background: "#fff", border: "1px solid #b0cfd0", borderRadius: 16, padding: "42px 20px", textAlign: "center", animation: "slideUp 0.35s 0.1s cubic-bezier(0.22,1,0.36,1) both" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(91,158,160,0.10)", border: "1px solid rgba(91,158,160,0.22)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <FiCalendar size={22} color="#5b9ea0" />
                </div>
                <p style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 15, fontWeight: 800, color: "#2d3250", margin: "0 0 4px" }}>Sin resultados</p>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, color: "#5b7a8a", margin: 0 }}>No hay expensas para el filtro seleccionado.</p>
              </div>
            );
          }
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {list.map((exp, i) => {
                const isUltimoMes = periodoToKey(exp.periodo) === ultimoPeriodoKey;
                return (
                  <FilaExpensa key={`${filtroEstado}-${exp.id}`} exp={exp} defaultOpen={isUltimoMes && i === 0} index={i} isUltimoMes={isUltimoMes} onPaid={() => marcarPagado(exp.id)} tendencia={tendencias[exp.id] ?? null} itemMorosidad={isUltimoMes ? itemMorosidad : null} />
                );
              })}
            </div>
          );
        })()
      )}

      <div style={{ height: 16 }} />
    </div>
  );
}