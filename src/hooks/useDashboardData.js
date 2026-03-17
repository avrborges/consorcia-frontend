import { useState, useEffect } from "react";

/* ─────────────────────────────────────────
   Mock data por consorcio
   Reemplazar por llamadas a la API real
───────────────────────────────────────── */
const MOCK_DATA = {
  c1: {
    expensa: {
      periodo: "Mayo 2025", monto: 42500,
      vencimiento: "10/06/2025", estado: "pendiente",
      totalUnidades: 24, pagas: 18, pendientes: 5, vencidas: 1,
    },
    mensajes:  { sinLeer: 3 },
    reclamos:  { abiertos: 5 },
    encuesta:  { titulo: "Pintura del pasillo",    vence: "20/06/2025", participantes: 8 },
    documentos: [
      { nombre: "Reglamento interno", fecha: "01/05/2025" },
      { nombre: "Acta reunión abril", fecha: "15/04/2025" },
    ],
  },
  c2: {
    expensa: {
      periodo: "Mayo 2025", monto: 55000,
      vencimiento: "15/06/2025", estado: "vencido",
      totalUnidades: 12, pagas: 8, pendientes: 2, vencidas: 2,
    },
    mensajes:  { sinLeer: 7 },
    reclamos:  { abiertos: 2 },
    encuesta:  { titulo: "Reglamento uso del SUM", vence: "25/06/2025", participantes: 5 },
    documentos: [
      { nombre: "Acta asamblea mayo", fecha: "10/05/2025" },
      { nombre: "Presupuesto 2025",   fecha: "02/01/2025" },
    ],
  },
};

const MOCK_UNIDADES = {
  c1: [
    { id: "3b", label: "Unidad 3B", expensa: { periodo: "Mayo 2025", monto: 42500, vencimiento: "10/06/2025", estado: "pendiente" } },
    { id: "7a", label: "Unidad 7A", expensa: { periodo: "Mayo 2025", monto: 38000, vencimiento: "10/06/2025", estado: "pago"      } },
  ],
  c2: [
    { id: "2c", label: "Unidad 2C", expensa: { periodo: "Mayo 2025", monto: 55000, vencimiento: "15/06/2025", estado: "vencido"   } },
  ],
};

/* ─────────────────────────────────────────
   Hook principal
   
   Uso:
     const { data, unidades, loading, error } = useDashboardData(consorcioId, role);
   
   Cuando conectes el backend:
   1. Reemplazá el bloque "MOCK" por fetch/axios
   2. El resto del componente no cambia
───────────────────────────────────────── */
export function useDashboardData(consorcioId, role) {
  const [data,     setData]     = useState(null);
  const [unidades, setUnidades] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    if (!consorcioId) return;

    setLoading(true);
    setError(null);

    // ── MOCK: simula latencia de red ──────────────────────
    // Reemplazar este bloque por:
    //
    // const res = await fetch(`/api/dashboard?consorcioId=${consorcioId}&role=${role}`);
    // const json = await res.json();
    // setData(json.data);
    // setUnidades(json.unidades);
    //
    // ─────────────────────────────────────────────────────
    const timer = setTimeout(() => {
      const mockData     = MOCK_DATA[consorcioId]     ?? MOCK_DATA["c1"];
      const mockUnidades = MOCK_UNIDADES[consorcioId] ?? [];

      setData(mockData);
      setUnidades(mockUnidades);
      setLoading(false);
    }, 0); // Sin delay real — cambiar a ~300ms al conectar el backend

    return () => clearTimeout(timer);
  }, [consorcioId, role]);

  return { data, unidades, loading, error };
}