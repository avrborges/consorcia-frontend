import { useState, useEffect, useCallback, useMemo } from "react";

/* ─────────────────────────────────────────────────────────────
   Mock data — reemplazar por fetch a services/api.js
───────────────────────────────────────────────────────────── */
const MOCK = {
  c1: {
    "owner@consorcia.com": [
      {
        id: "c1-u3b-may25", unidad: "Unidad 3B", periodo: "Mayo 2025",
        estado: "pendiente", monto: 42500, vencimiento1: "10/05/2025", vencimiento2: "20/05/2025",
        items: [
          { concepto: "Expensas ordinarias", monto: 32000 },
          { concepto: "Fondo de reserva",    monto: 6500  },
          { concepto: "Agua",                monto: 4000  },
        ],
      },
      {
        id: "c1-u3b-abr25", unidad: "Unidad 3B", periodo: "Abril 2025",
        estado: "pago", monto: 40000, fechaPago: "08/04/2025",
        items: [],
      },
      {
        id: "c1-u3b-mar25", unidad: "Unidad 3B", periodo: "Marzo 2025",
        estado: "pago", monto: 38500, fechaPago: "07/03/2025",
        items: [],
      },
    ],
  },
};

function getMockData(consorcioId, email) {
  return MOCK[consorcioId]?.[email] ?? [];
}

/* ─────────────────────────────────────────────────────────────
   Persistencia de overrides en sessionStorage
   Clave: "expensas_overrides_{consorcioId}_{email}"
   Se limpia al cerrar el tab (sessionStorage) o al hacer logout.
   Al conectar el backend, eliminar todo este bloque.
───────────────────────────────────────────────────────────── */
function getStorageKey(consorcioId, email) {
  return `expensas_overrides_${consorcioId}_${email}`;
}

function loadOverrides(consorcioId, email) {
  try {
    const raw = sessionStorage.getItem(getStorageKey(consorcioId, email));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveOverrides(consorcioId, email, overrides) {
  try {
    sessionStorage.setItem(getStorageKey(consorcioId, email), JSON.stringify(overrides));
  } catch {
    // sessionStorage no disponible — degradación silenciosa
  }
}

/* ─────────────────────────────────────────────────────────────
   Helper: convierte "Mayo 2025" → "2025-05" para comparar
───────────────────────────────────────────────────────────── */
const MESES = {
  enero: "01", febrero: "02", marzo: "03", abril: "04",
  mayo: "05", junio: "06", julio: "07", agosto: "08",
  septiembre: "09", octubre: "10", noviembre: "11", diciembre: "12",
};

export function periodoToKey(periodo) {
  if (!periodo) return "";
  const [mes, anio] = periodo.toLowerCase().split(" ");
  return `${anio}-${MESES[mes] ?? "00"}`;
}

/* ─────────────────────────────────────────────────────────────
   Hook principal
───────────────────────────────────────────────────────────── */
export function useExpensasData(consorcioId, email) {
  const [baseHistorial, setBaseHistorial] = useState([]);
  const [overrides,     setOverrides]     = useState(() => loadOverrides(consorcioId, email));
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);

  // Carga inicial (mock — reemplazar por fetch)
  useEffect(() => {
    setLoading(true);
    // Al cambiar consorcio/email, cargar overrides correspondientes
    setOverrides(loadOverrides(consorcioId, email));
    const t = setTimeout(() => {
      try {
        setBaseHistorial(getMockData(consorcioId, email));
        setError(null);
      } catch (e) {
        setError("No se pudieron cargar las expensas.");
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [consorcioId, email]);

  // Historial con overrides aplicados
  const historial = useMemo(
    () => baseHistorial.map(e => overrides[e.id] ? { ...e, ...overrides[e.id] } : e),
    [baseHistorial, overrides]
  );

  // Período más reciente
  const ultimoPeriodoKey = useMemo(
    () => historial.reduce((max, e) => {
      const k = periodoToKey(e.periodo);
      return k > max ? k : max;
    }, ""),
    [historial]
  );

  // Resumen de estados
  const resumen = useMemo(() => ({
    saldo:               historial.filter(e => ["pendiente","vencido","parcial"].includes(e.estado)).reduce((s, e) => s + e.monto, 0),
    pendientes:          historial.filter(e => e.estado === "pendiente").length,
    vencidas:            historial.filter(e => e.estado === "vencido").length,
    parciales:           historial.filter(e => e.estado === "parcial").length,
    pendienteValidacion: historial.filter(e => e.estado === "pendiente_validacion").length,
    rechazados:          historial.filter(e => e.estado === "comprobante_rechazado").length,
    pagas:               historial.filter(e => ["pago","pago_con_recargo","vencido_pagado"].includes(e.estado)).length,
  }), [historial]);

  // Tendencias (% variación respecto al mes anterior)
  const tendencias = useMemo(() => {
    const sorted = [...historial].sort((a, b) => periodoToKey(b.periodo).localeCompare(periodoToKey(a.periodo)));
    return sorted.reduce((acc, exp, i) => {
      const prev = sorted[i + 1];
      if (prev && prev.monto) {
        acc[exp.id] = Math.round(((exp.monto - prev.monto) / prev.monto) * 100);
      } else {
        acc[exp.id] = null;
      }
      return acc;
    }, {});
  }, [historial]);

  // Item morosidad para el último mes
  const itemMorosidad = useMemo(() => {
    const deudaAnterior = historial
      .filter(e => periodoToKey(e.periodo) < ultimoPeriodoKey && ["pendiente","vencido"].includes(e.estado))
      .reduce((s, e) => s + e.monto, 0);
    if (!deudaAnterior) return null;
    return {
      concepto:    "Deuda anterior c/ recargo (3%)",
      monto:       Math.round(deudaAnterior * 0.03),
      _morosidad:  true,
    };
  }, [historial, ultimoPeriodoKey]);

  /* ── Helper interno: aplicar override y persistir ── */
  const applyOverride = useCallback((id, patch) => {
    setOverrides(prev => {
      const next = { ...prev, [id]: { ...(prev[id] ?? {}), ...patch } };
      saveOverrides(consorcioId, email, next);
      return next;
    });
  }, [consorcioId, email]);

  /* ── Acción: marcar como pendiente de validación ── */
  const markAsPendienteValidacion = useCallback((id) => {
    applyOverride(id, { estado: "pendiente_validacion" });
  }, [applyOverride]);

  /* ── Acción: marcar como rechazado (con motivo) ── */
  const markAsRechazado = useCallback((id, motivo = "") => {
    applyOverride(id, { estado: "comprobante_rechazado", motivoRechazo: motivo });
  }, [applyOverride]);

  return {
    historial,
    resumen,
    tendencias,
    itemMorosidad,
    ultimoPeriodoKey,
    loading,
    error,
    periodoToKey,
    markAsPendienteValidacion,
    markAsRechazado,
  };
}