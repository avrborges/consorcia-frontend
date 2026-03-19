import { useEffect, useMemo, useState, useCallback } from "react";

/* ─────────────────────────────────────────
   MOCK DINÁMICO ANCLADO A MARZO 2026
   (para que siempre coincida con el escenario
    que estás modelando)
───────────────────────────────────────── */
const BASE_DATE = new Date(2026, 2, 1); // Marzo 2026 (mes 2 = marzo)

/* ─────────────────────────────────────────
   Generador de períodos y mock data
───────────────────────────────────────── */
const MESES_ES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

function pad(n) { return String(n).padStart(2, "0"); }

// Devuelve { periodo, vencimiento1, vencimiento2, mesKey } para N meses atrás (0 = mes actual de BASE_DATE)
function getPeriodo(mesesAtras = 0) {
  const d = new Date(BASE_DATE);
  d.setDate(1);
  d.setMonth(d.getMonth() - mesesAtras);

  const mes  = d.getMonth();
  const anio = d.getFullYear();

  // Vencimientos: mes siguiente al período
  const sig = new Date(d);
  sig.setMonth(sig.getMonth() + 1);

  return {
    periodo:      `${MESES_ES[mes]} ${anio}`,
    vencimiento1: `15/${pad(sig.getMonth() + 1)}/${sig.getFullYear()}`,
    vencimiento2: `25/${pad(sig.getMonth() + 1)}/${sig.getFullYear()}`,
    mesKey:       `${pad(mes + 1)}${String(anio).slice(2)}`,
  };
}

function formatFechaPago(dia, mesesAtras) {
  // fecha de pago ubicada en el mes de vencimiento (mes siguiente al periodo)
  const d = new Date(BASE_DATE);
  d.setDate(1);
  d.setMonth(d.getMonth() - mesesAtras + 1);
  return `${pad(dia)}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function formatHoy() {
  const d = new Date();
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function buildHistorial(unidad, baseMontos, estados) {
  // estados: array de { estado, fechaPagoDia? } del más reciente al más antiguo
  return estados.map((s, i) => {
    const p = getPeriodo(i);
    const montoBase = baseMontos[i] ?? baseMontos.at(-1);

    const items = [
      { concepto: "Expensa ordinaria",      monto: Math.round(montoBase * 0.66) },
      { concepto: "Fondo de reserva",       monto: Math.round(montoBase * 0.12) },
      { concepto: "Seguro del edificio",    monto: Math.round(montoBase * 0.10) },
      { concepto: "Servicio de limpieza",   monto: Math.round(montoBase * 0.09) },
      { concepto: "Mantenimiento ascensor", monto: Math.round(montoBase * 0.03) },
    ];

    // Ajuste para que sume exacto el montoBase
    const suma = items.reduce((a, b) => a + b.monto, 0);
    items[0].monto += montoBase - suma;

    const entry = {
      id:           `e-${unidad.replace(/\s/g, "")}-${p.mesKey}`,
      periodo:      p.periodo,
      vencimiento1: p.vencimiento1,
      vencimiento2: p.vencimiento2,
      estado:       s.estado,
      monto:        montoBase,
      unidad,
      items,
    };

    if (s.fechaPagoDia) {
      entry.fechaPago = formatFechaPago(s.fechaPagoDia, i);
    }

    // pago_con_recargo → +3% SOLO en ese período (no arrastra)
    if (s.estado === "pago_con_recargo") {
      const recargo = Math.round(montoBase * 0.03);
      entry.items.push({ concepto: "Recargo 2do vencimiento (3%)", monto: recargo, _recargo: true });
      entry.monto += recargo;
    }

    // vencido_pagado → registra +3% en esa liquidación
    // y (según tu regla) arrastra SOLO ese 3% al siguiente período
    if (s.estado === "vencido_pagado") {
      const recargo = Math.round(montoBase * 0.03);
      entry.items.push({ concepto: "Recargo por morosidad (3%)", monto: recargo, _recargo: true });
      entry.monto += recargo;
    }

    return entry;
  });
}

/* ─────────────────────────────────────────
   MOCK_HISTORIAL – Las Acacias (c1)
   Escenario: Mes actual = Marzo 2026

   Reglas que modela:
   - Febrero 2026 vencido -> arrastra a Marzo: deuda + 3%
   - Enero 2026 vencido   -> arrastra a Febrero: deuda + 3%
   - Diciembre 2025 vencido_pagado -> arrastra a Enero SOLO 3%
   - pago_con_recargo -> NO arrastra
   - pago -> NO arrastra
───────────────────────────────────────── */
const MOCK_HISTORIAL = {
  "owner@consorcia.com": {
    // Edificio Las Acacias (c1)
    c1: buildHistorial("Unidad 3B", [42500, 41200, 39800, 38600, 37200, 36000], [
      { estado: "pendiente" },                         // Marzo 2026 (actual)
      { estado: "vencido" },                           // Febrero 2026
      { estado: "vencido" },                           // Enero 2026
      { estado: "vencido_pagado", fechaPagoDia: 28 },  // Diciembre 2025
      { estado: "pago_con_recargo", fechaPagoDia: 20 },// Noviembre 2025
      { estado: "pago", fechaPagoDia: 10 },            // Octubre 2025
    ]),

    // (Opcional) otro consorcio del mismo user
    c2: buildHistorial("Unidad 5D", [55000, 52000, 50500], [
      { estado: "pendiente" }, // Marzo 2026
      { estado: "pago", fechaPagoDia: 9 },
      { estado: "pago_con_recargo", fechaPagoDia: 22 },
    ]),
  },

  "owner2@consorcia.com": {
    c3: buildHistorial("Unidad 4A", [31000, 30000, 29500], [
      { estado: "pago", fechaPagoDia: 3 },
      { estado: "pago", fechaPagoDia: 2 },
      { estado: "pago", fechaPagoDia: 4 },
    ]),
  },

  "tenant@consorcia.com": {
    c1: buildHistorial("Unidad 3B", [42500, 40000, 39200], [
      { estado: "pendiente" },
      { estado: "pago", fechaPagoDia: 9 },
      { estado: "pago", fechaPagoDia: 7 },
    ]),
  },
};

/* ─────────────────────────────────────────
   Helpers de negocio
───────────────────────────────────────── */
const MONTHS_ES_MAP = {
  enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
  julio: 7, agosto: 8, septiembre: 9, setiembre: 9, octubre: 10,
  noviembre: 11, diciembre: 12,
};

function periodoToKey(periodo) {
  if (!periodo || typeof periodo !== "string") return -1;
  const parts = periodo.trim().toLowerCase().split(/\s+/);
  if (parts.length < 2) return -1;
  const mes = MONTHS_ES_MAP[parts[0]];
  const anio = Number(parts[1]);
  if (!mes || !anio) return -1;
  return anio * 12 + mes;
}

const ESTADOS_PAGADOS = ["pago", "pago_con_recargo", "vencido_pagado"];
const ESTADOS_IMPAGOS_SALDO = ["pendiente", "vencido", "parcial", "comprobante_rechazado"];

/**
 * Devuelve monto base (sin recargos de items _recargo)
 * útil para calcular 3% cuando el monto ya trae recargo agregado
 */
function getMontoBase(exp) {
  const recargos = (exp.items || [])
    .filter((i) => i?._recargo)
    .reduce((s, i) => s + (i.monto || 0), 0);

  return Math.max(0, (exp.monto || 0) - recargos);
}

/* ─────────────────────────────────────────
   Hook principal
───────────────────────────────────────── */
export function useExpensasData(consorcioId, userEmail) {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  /* ── Carga MOCK (backend-ready) ── */
  useEffect(() => {
    if (!consorcioId || !userEmail) {
      setHistorial([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const t = setTimeout(() => {
      try {
        const data = MOCK_HISTORIAL[userEmail]?.[consorcioId] ?? [];
        setHistorial(data);
        setLoading(false);
      } catch (e) {
        setError("No se pudieron cargar las expensas");
        setLoading(false);
      }
    }, 0);

    return () => clearTimeout(t);
  }, [consorcioId, userEmail]);

  /* ── Último período (actual) ── */
  const ultimoPeriodoKey = useMemo(() => {
    if (!historial.length) return -1;
    return historial.reduce((max, e) => Math.max(max, periodoToKey(e.periodo)), -1);
  }, [historial]);

  /* ─────────────────────────────────────────
     ARRASTRE ENCADENADO (old -> new)
     Reglas:
       - vencido        : arrastra deuda completa + 3% morosidad
       - vencido_pagado : arrastra SOLO 3% morosidad
       - pago_con_recargo / pago : NO arrastra
  ────────────────────────────────────────── */
  const arrastreById = useMemo(() => {
    if (!historial.length) return {};

    // orden del más viejo al más nuevo
    const sorted = [...historial].sort(
      (a, b) => periodoToKey(a.periodo) - periodoToKey(b.periodo)
    );

    let carryIn = 0; // arrastre que entra al período actual del loop
    const map = {};

    for (let i = 0; i < sorted.length; i++) {
      const exp = sorted[i];

      const arrastreIn = carryIn;
      const totalAdeudado = (exp.monto ?? 0) + arrastreIn;

      map[exp.id] = {
        arrastreIn,
        totalAdeudado,
        prevId: i > 0 ? sorted[i - 1].id : null,
        prevPeriodo: i > 0 ? sorted[i - 1].periodo : null,
        prevEstado: i > 0 ? sorted[i - 1].estado : null,
      };

      // carryOut según estado del período actual
      if (exp.estado === "vencido") {
        // deuda completa + 3% morosidad (sobre el total adeudado)
        const recargo = Math.round(totalAdeudado * 0.03);
        carryIn = totalAdeudado + recargo;
      } else if (exp.estado === "vencido_pagado") {
        // SOLO 3% morosidad (sobre monto base)
        const base = getMontoBase(exp);
        carryIn = Math.round(base * 0.03);
      } else {
        // pago / pago_con_recargo / etc → no arrastra
        carryIn = 0;
      }
    }

    return map;
  }, [historial]);

  /* ── Item de morosidad para el período actual (último) ── */
  const itemMorosidad = useMemo(() => {
    if (!historial.length || ultimoPeriodoKey === -1) return null;

    const actual = historial.find(
      (e) => periodoToKey(e.periodo) === ultimoPeriodoKey
    );
    if (!actual) return null;

    const info = arrastreById[actual.id];
    if (!info || !info.arrastreIn || info.arrastreIn <= 0) return null;

    const label =
      info.prevEstado === "vencido_pagado"
        ? `Morosidad pendiente 3% (${info.prevPeriodo})`
        : `Deuda anterior + morosidad 3% (${info.prevPeriodo})`;

    return {
      concepto: label,
      monto: info.arrastreIn,
      _morosidad: true,
    };
  }, [historial, ultimoPeriodoKey, arrastreById]);

  /* ─────────────────────────────────────────
     ✅ SALDO AJUSTADO (sin duplicar)
     El Saldo Pendiente debe reflejar lo que
     se paga en el período actual (Marzo):
       saldo = monto del período actual (si impago)
             + arrastreIn del período actual
  ────────────────────────────────────────── */
  const resumen = useMemo(() => {
    const pagas = historial.filter((e) => ESTADOS_PAGADOS.includes(e.estado)).length;
    const pendientes = historial.filter((e) => e.estado === "pendiente").length;
    const vencidas = historial.filter((e) => e.estado === "vencido").length;
    const parciales = historial.filter((e) => e.estado === "parcial").length;

    let saldo = 0;

    if (ultimoPeriodoKey !== -1) {
      const actual = historial.find(
        (e) => periodoToKey(e.periodo) === ultimoPeriodoKey
      );

      if (actual && ESTADOS_IMPAGOS_SALDO.includes(actual.estado)) {
        const arrastreActual = arrastreById?.[actual.id]?.arrastreIn ?? 0;
        saldo = (actual.monto ?? 0) + arrastreActual;
      }
    }

    return { pagas, pendientes, vencidas, parciales, saldo };
  }, [historial, ultimoPeriodoKey, arrastreById]);

  /* ── Tendencias (vs mes anterior por orden del array) ── */
  const tendencias = useMemo(() => {
    const map = {};
    historial.forEach((exp, i) => {
      const prev = historial[i + 1];
      if (!prev || !prev.monto) {
        map[exp.id] = null;
        return;
      }
      const diff = (((exp.monto ?? 0) - (prev.monto ?? 0)) / prev.monto) * 100;
      map[exp.id] = Math.round(diff);
    });
    return map;
  }, [historial]);

  /* ── Acción mock: marcar como pagado ── */
  const markAsPaid = useCallback((id) => {
    setHistorial((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        if (ESTADOS_PAGADOS.includes(e.estado)) return e;
        return { ...e, estado: "pago", fechaPago: formatHoy() };
      })
    );
  }, []);

  return {
    historial,
    resumen,
    tendencias,
    itemMorosidad,
    ultimoPeriodoKey,
    loading,
    error,
    markAsPaid,
    periodoToKey,
    arrastreById, // opcional: útil si luego querés mostrar arrastre en Febrero también
  };
}