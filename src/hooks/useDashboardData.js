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
  c3: {
    expensa: {
      periodo: "Mayo 2025", monto: 31000,
      vencimiento: "05/06/2025", estado: "pago",
      totalUnidades: 8, pagas: 7, pendientes: 1, vencidas: 0,
    },
    mensajes:  { sinLeer: 1 },
    reclamos:  { abiertos: 0 },
    encuesta:  { titulo: "Elección de administrador", vence: "30/06/2025", participantes: 3 },
    documentos: [
      { nombre: "Reglamento de copropiedad", fecha: "15/03/2025" },
      { nombre: "Acta reunión marzo",        fecha: "20/03/2025" },
    ],
  },
};

const MOCK_UNIDADES = {
  // Consorcio c1 — Edificio Las Acacias
  // Juan Pérez (owner): 3B y 7A
  // Laura Martínez (owner2): ninguna en c1
  c1: [
    { id:"3b", label:"Unidad 3B", userId:"owner@consorcia.com",  expensa:{ periodo:"Mayo 2025", monto:42500, vencimiento:"10/06/2025", estado:"pendiente" } },
    { id:"7a", label:"Unidad 7A", userId:"owner@consorcia.com",  expensa:{ periodo:"Mayo 2025", monto:38000, vencimiento:"10/06/2025", estado:"pago"      } },
    { id:"2c", label:"Unidad 2C", userId:"other",                expensa:{ periodo:"Mayo 2025", monto:41000, vencimiento:"10/06/2025", estado:"pago"      } },
  ],
  // Consorcio c2 — Torre San Martín
  // Juan Pérez (owner): 5D
  // Laura Martínez (owner2): ninguna en c2
  c2: [
    { id:"5d", label:"Unidad 5D", userId:"owner@consorcia.com",  expensa:{ periodo:"Mayo 2025", monto:55000, vencimiento:"15/06/2025", estado:"vencido"   } },
    { id:"1a", label:"Unidad 1A", userId:"other",                expensa:{ periodo:"Mayo 2025", monto:52000, vencimiento:"15/06/2025", estado:"pago"      } },
  ],
  // Consorcio c3 — Complejo Los Olivos
  // Laura Martínez (owner2): 4A
  c3: [
    { id:"4a", label:"Unidad 4A", userId:"owner2@consorcia.com", expensa:{ periodo:"Mayo 2025", monto:31000, vencimiento:"05/06/2025", estado:"pago"      } },
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
export function useDashboardData(consorcioId, role, userEmail) {
  const [data,     setData]     = useState(null);
  const [unidades, setUnidades] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    if (!consorcioId) return;

    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      const mockData = MOCK_DATA[consorcioId] ?? MOCK_DATA["c1"];
      const todasUnidades = MOCK_UNIDADES[consorcioId] ?? [];

      // Para roles propietario/inquilino: filtrar solo sus unidades
      // Para admin/council: no aplica filtro de unidades
      const unidadesFiltradas = (role === "owner" || role === "tenant")
        ? todasUnidades.filter(u => u.userId === userEmail)
        : todasUnidades;

      setData(mockData);
      setUnidades(unidadesFiltradas);
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [consorcioId, role, userEmail]);

  return { data, unidades, loading, error };
}